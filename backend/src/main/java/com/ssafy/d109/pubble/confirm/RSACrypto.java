package com.ssafy.d109.pubble.confirm;

import com.ssafy.d109.pubble.dto.requestDto.RequirementConfirmRequestDto;
import lombok.extern.log4j.Log4j2;

import javax.crypto.Cipher;
import java.security.*;
import java.security.spec.PKCS8EncodedKeySpec;
import java.security.spec.X509EncodedKeySpec;
import java.util.Base64;
import java.util.HashMap;
import java.util.UUID;

@Log4j2
public class RSACrypto {

    public HashMap<String, String> createKeyPairAsString() {
        HashMap<String, String> stringKeyPair = new HashMap<>();

        try {
            SecureRandom secureRandom = new SecureRandom();
            KeyPairGenerator keyPairGenerator = KeyPairGenerator.getInstance("RSA");
            keyPairGenerator.initialize(2048, secureRandom);
            KeyPair keyPair = keyPairGenerator.genKeyPair();

            PublicKey publicKey = keyPair.getPublic();
            PrivateKey privateKey = keyPair.getPrivate();

            String stringPublicKey = Base64.getEncoder().encodeToString(publicKey.getEncoded());
            String stringPrivateKey = Base64.getEncoder().encodeToString(privateKey.getEncoded());

            log.info("================stringPublicKey: {} ", stringPublicKey);
            log.info("================stringPrivateKey: {}" , stringPrivateKey);

            stringKeyPair.put("publicKey", stringPublicKey);
            stringKeyPair.put("privateKey", stringPrivateKey);

        } catch (NoSuchAlgorithmException e) {
            throw new RuntimeException(e);
        }
        return stringKeyPair;

    }

    public String encrypt(String plainText, String stringPublicKey) {
        String encryptedText = null;

        try {
            KeyFactory keyFactory = KeyFactory.getInstance("RSA");
            byte[] bytePublicKey = Base64.getDecoder().decode(stringPublicKey.getBytes());
            X509EncodedKeySpec publicKeySpec = new X509EncodedKeySpec(bytePublicKey);
            PublicKey publicKey = keyFactory.generatePublic(publicKeySpec);

            Cipher cipher = Cipher.getInstance("RSA");
            cipher.init(Cipher.ENCRYPT_MODE, publicKey);

            byte[] encryptedBytes = cipher.doFinal(plainText.getBytes());
            encryptedText = Base64.getEncoder().encodeToString(encryptedBytes);

        } catch (Exception e) {
            throw new RuntimeException(e);
        }

        return encryptedText;

    }

    public String decrypt(String encryptedText, String stringPrivateKey) {
        String decryptedText = null;

        try {
            KeyFactory keyFactory = KeyFactory.getInstance("RSA");
            byte[] bytePrivateKey = Base64.getDecoder().decode(stringPrivateKey.getBytes());
            PKCS8EncodedKeySpec privateKeySpec = new PKCS8EncodedKeySpec(bytePrivateKey);
            PrivateKey privateKey = keyFactory.generatePrivate(privateKeySpec);

            Cipher cipher = Cipher.getInstance("RSA");
            cipher.init(Cipher.DECRYPT_MODE, privateKey);

            byte[] encryptedBytes = Base64.getDecoder().decode(encryptedText.getBytes());
            byte[] decryptedBytes = cipher.doFinal(encryptedBytes);
            decryptedText = new String(decryptedBytes);

        } catch (Exception e) {
            throw new RuntimeException(e);
        }

        return decryptedText;
    }

    public String signRequest(RequirementConfirmRequestDto reqDto, String stringPrivateKey) throws Exception {

        PrivateKey privateKey = getPrivateKey(stringPrivateKey);
        String messageToSign = reqDto.getApproval() + reqDto.getApprovalComment();
        byte[] signature = signData(messageToSign, privateKey);

        return Base64.getEncoder().encodeToString(signature);
    }

    public Boolean verifyRequest(RequirementConfirmRequestDto reqDto, String signatue, String stringPublicKey) throws Exception {
        PublicKey publicKey = getPublicKey(stringPublicKey);
        String messageToVerify = reqDto.getApproval() + reqDto.getApprovalComment();
        byte[] signatureBytes = Base64.getDecoder().decode(signatue);

        return verifySignature(messageToVerify, signatureBytes, publicKey);
    }


    // 네트워크를 통해 전송되거나, 외부 저장소에 저장된 키를 사용할 때 필요
    private PublicKey getPublicKey(String stringPublicKey) throws Exception {
        KeyFactory keyFactory = KeyFactory.getInstance("RSA");
        byte[] bytePublicKey = Base64.getDecoder().decode(stringPublicKey.getBytes());
        X509EncodedKeySpec publicKeySpec = new X509EncodedKeySpec(bytePublicKey);

        return keyFactory.generatePublic(publicKeySpec);
    }

    private PrivateKey getPrivateKey(String stringPrivateKey) throws Exception {
        KeyFactory keyFactory = KeyFactory.getInstance("RSA");
        byte[] bytePrivateKey = Base64.getDecoder().decode(stringPrivateKey.getBytes());
        PKCS8EncodedKeySpec privateKeySpec = new PKCS8EncodedKeySpec(bytePrivateKey);

        return keyFactory.generatePrivate(privateKeySpec);
    }

    private byte[] signData(String data, PrivateKey privateKey) throws Exception {
        Signature privateSignature = Signature.getInstance("SHA256withRSA");
        privateSignature.initSign(privateKey);
        privateSignature.update(data.getBytes());

        return privateSignature.sign();
    }

    private boolean verifySignature(String data, byte[] signature, PublicKey publicKey) throws Exception {
        Signature publicSignature = Signature.getInstance("SHA256withRSA");
        publicSignature.initVerify(publicKey);
        publicSignature.update(data.getBytes());

        return publicSignature.verify(signature);
    }

}
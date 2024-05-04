package com.ssafy.d109.pubble.service;

import com.ssafy.d109.pubble.confirm.RSACrypto;
import com.ssafy.d109.pubble.dto.request.ConfirmDataDto;
import com.ssafy.d109.pubble.entity.Requirement;
import com.ssafy.d109.pubble.exception.Requirement.RequirementNotFoundException;
import com.ssafy.d109.pubble.repository.RequirementRepository;
import jakarta.transaction.Transactional;
import lombok.extern.log4j.Log4j2;
import org.springframework.stereotype.Service;

import javax.crypto.Cipher;
import java.security.*;
import java.security.spec.PKCS8EncodedKeySpec;
import java.security.spec.X509EncodedKeySpec;
import java.util.Base64;
import java.util.HashMap;

@Service
@Log4j2
public class RequirementConfirmService {

    private final RequirementRepository requirementRepository;

    public RequirementConfirmService(RequirementRepository requirementRepository) {
        this.requirementRepository = requirementRepository;
    }

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

    public Boolean isLocked(String isLock) {
        if (isLock.equals("l")) {
            return true;
        }

        return false;
    }


    @Transactional
    public void approveRequirement(Requirement requirement) {

        requirement.setApproval("a");
        requirementRepository.save(requirement);

    }


    @Transactional
    public void updateApprovalComment(Requirement requirement, String approvalComment) {
        requirement.setApprovalComment(approvalComment);
        requirementRepository.save(requirement);
    }


    private String encrypt(String plainText, String stringPublicKey) {
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


    private String decrypt(String encryptedText, String stringPrivateKey) {
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


    // 전자서명
    public String signData(ConfirmDataDto dto, String stringPrivateKey) {
        String signature = null;

        try {

            String data = dto.toSignatureString();
            byte[] dataBytes = data.getBytes();
            KeyFactory keyFactory = KeyFactory.getInstance("RSA");
            byte[] bytePrivateKey = Base64.getDecoder().decode(stringPrivateKey.getBytes());
            PKCS8EncodedKeySpec privateKeySpec = new PKCS8EncodedKeySpec(bytePrivateKey);
            PrivateKey privateKey = keyFactory.generatePrivate(privateKeySpec);

            Signature privateSignature = Signature.getInstance("SHA256withRSA");
            privateSignature.initSign(privateKey);
            privateSignature.update(dataBytes);

            byte[] signatureBytes = privateSignature.sign();
            signature = Base64.getEncoder().encodeToString(signatureBytes);

        } catch (Exception e) {
            throw new RuntimeException(e);
        }

        return signature;
    }


    // 검증
    public Boolean verifySignature(ConfirmDataDto dto, String signature, String stringPublicKey) {

        try {
            String data = dto.toSignatureString();
            byte[] dataBytes = data.getBytes();
            byte[] signatureBytes = Base64.getDecoder().decode(signature);

            KeyFactory keyFactory = KeyFactory.getInstance("RSA");
            byte[] bytePublicKey = Base64.getDecoder().decode(stringPublicKey.getBytes());
            X509EncodedKeySpec publicKeySpec = new X509EncodedKeySpec(bytePublicKey);
            PublicKey publicKey = keyFactory.generatePublic(publicKeySpec);

            Signature publicSignature = Signature.getInstance("SHA256withRSA");
            publicSignature.initVerify(publicKey);
            publicSignature.update(dataBytes);

            return publicSignature.verify(signatureBytes);

        } catch (Exception e) {
            throw new RuntimeException(e);
        }

    }






}
package com.ssafy.d109.pubble.service;

import com.amazonaws.services.s3.model.CannedAccessControlList;
import com.amazonaws.services.s3.model.ObjectMetadata;
import com.amazonaws.services.s3.model.PutObjectRequest;
import com.ssafy.d109.pubble.config.S3Config;
import com.ssafy.d109.pubble.entity.Requirement;
import com.ssafy.d109.pubble.entity.Upload;
import com.ssafy.d109.pubble.entity.User;
import com.ssafy.d109.pubble.exception.Requirement.RequirementNotFoundException;
import com.ssafy.d109.pubble.repository.RequirementRepository;
import com.ssafy.d109.pubble.repository.UploadRepository;
import com.ssafy.d109.pubble.util.CommonUtil;
import jakarta.transaction.Transactional;
import lombok.extern.log4j.Log4j2;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.multipart.MultipartRequest;

import java.io.File;
import java.io.IOException;
import java.util.UUID;

@Service
@Log4j2
public class ImageService {

    private final S3Config s3Config;
    private UploadRepository uploadRepository;
    private final CommonUtil commonUtil;
    private final RequirementRepository requirementRepository;

    public ImageService(S3Config s3Config, UploadRepository uploadRepository, CommonUtil commonUtil, RequirementRepository requirementRepository) {
        this.s3Config = s3Config;
        this.uploadRepository = uploadRepository;
        this.commonUtil = commonUtil;
        this.requirementRepository = requirementRepository;
    }

    @Value("${cloud.aws.s3.bucket}")
    private String bucket;

    private String localLocation = System.getProperty("java.io.tmpdir");

    @Transactional
    public void uploadImage(MultipartFile file, Integer requirementId) throws IOException {
        String fileName = file.getOriginalFilename();
        String ext = fileName.substring(fileName.lastIndexOf("."));
        String uuidFileName = UUID.randomUUID().toString() + ext;

        // Prepare metadata for the file
        ObjectMetadata metadata = new ObjectMetadata();
        metadata.setContentLength(file.getSize());
        metadata.setContentType(file.getContentType());

        // Upload file directly without setting ACL
        s3Config.amazonS3Client().putObject(new PutObjectRequest(bucket, uuidFileName, file.getInputStream(), metadata));
        String s3Url = s3Config.amazonS3Client().getUrl(bucket, uuidFileName).toString();

        User currentUser = commonUtil.getUser();
        Requirement requirement = requirementRepository.findRequirementByRequirementId(requirementId)
                .orElseThrow(RequirementNotFoundException::new);

        Upload upload = Upload.builder()
                .user(currentUser)
                .requirement(requirement)
                .image(s3Url)
                .build();

        log.info("Uploaded to S3 URL: {}", s3Url);

        uploadRepository.save(upload);
    }


}

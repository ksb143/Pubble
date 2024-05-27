package com.ssafy.d109.pubble.service;

import com.amazonaws.services.s3.model.ObjectMetadata;
import com.amazonaws.services.s3.model.PutObjectRequest;
import com.ssafy.d109.pubble.config.S3Config;
import com.ssafy.d109.pubble.entity.Requirement;
import com.ssafy.d109.pubble.entity.Upload;
import com.ssafy.d109.pubble.entity.User;
import com.ssafy.d109.pubble.exception.requirement.RequirementNotFoundException;
import com.ssafy.d109.pubble.repository.RequirementRepository;
import com.ssafy.d109.pubble.repository.UploadRepository;
import com.ssafy.d109.pubble.util.CommonUtil;
import jakarta.transaction.Transactional;
import lombok.extern.log4j.Log4j2;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.UUID;

@Service
@Log4j2
public class FileService {

    private final S3Config s3Config;
    private final CommonUtil commonUtil;
    private final RequirementRepository requirementRepository;
    private final UploadRepository uploadRepository;

    public FileService(S3Config s3Config, CommonUtil commonUtil, RequirementRepository requirementRepository, UploadRepository uploadRepository) {
        this.s3Config = s3Config;
        this.commonUtil = commonUtil;
        this.requirementRepository = requirementRepository;
        this.uploadRepository = uploadRepository;
    }

    @Value("${cloud.aws.s3.bucket}")
    private String bucket;

    @Transactional
    public String uploadFile(MultipartFile file, Integer requirementId) throws IOException {

        String fileName = file.getOriginalFilename();
        String ext = "";  // 초기 확장자 값을 빈 문자열로 설정
        if (fileName != null && fileName.contains(".")) {
            ext = fileName.substring(fileName.lastIndexOf(".") + 1);
        }
//        String ext = fileName.substring(fileName.lastIndexOf("."));
        String uuidFileName = UUID.randomUUID().toString() + ext;

        ObjectMetadata metadata = new ObjectMetadata();
        metadata.setContentLength(file.getSize());
        metadata.setContentType(file.getContentType());
        metadata.setContentType(file.getContentType());
        if ("txt".equals(ext) || "docs".equals(ext) || "hwpx".equals(ext) || "pdf".equals(ext) || "hwp".equals(ext)) {
            metadata.setContentType(file.getContentType() + "; charset=utf-8");
        }

        s3Config.amazonS3Client().putObject(new PutObjectRequest(bucket, uuidFileName, file.getInputStream(), metadata));
        String s3Url = s3Config.amazonS3Client().getUrl(bucket, uuidFileName).toString();

        User currentUser = commonUtil.getUser();
        Requirement requirement = requirementRepository.findRequirementByRequirementId(requirementId)
                .orElseThrow(RequirementNotFoundException::new);

        Upload upload = Upload.builder()
                .user(currentUser)
                .requirement(requirement)
                .link(s3Url)
                .type(ext)
                .file("Y")
                .build();

        log.info("Uploaded file to S3 URL: {}", s3Url);
        uploadRepository.save(upload);

        return s3Url;

    }


}

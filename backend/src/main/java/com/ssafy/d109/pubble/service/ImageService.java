package com.ssafy.d109.pubble.service;

import com.amazonaws.services.s3.model.CannedAccessControlList;
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
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.multipart.MultipartRequest;

import java.io.File;
import java.io.IOException;
import java.util.UUID;

@Service
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
    public void uploadImage(MultipartRequest request, Integer requirementId) throws IOException {

        MultipartFile file = request.getFile("upload");

        String fileName = file.getOriginalFilename();
        String ext = fileName.substring(fileName.indexOf("."));
        String uuidFileName = UUID.randomUUID() + ext;
        String localPath = localLocation + uuidFileName;

        File localFile = new File(localPath);
        file.transferTo(localFile);

        s3Config.amazonS3Client().putObject(new PutObjectRequest(bucket, uuidFileName, localFile).withCannedAcl(CannedAccessControlList.PublicRead));
        String s3Url = s3Config.amazonS3Client().getUrl(bucket, uuidFileName).toString();

        User currentUser = commonUtil.getUser();
        Requirement requirement = requirementRepository.findRequirementByRequirementId(requirementId).orElseThrow(RequirementNotFoundException::new);

        Upload upload = Upload.builder()
                .user(currentUser)
                .requirement(requirement)
                .image(s3Url)
                .build();

        uploadRepository.save(upload);

    }

}

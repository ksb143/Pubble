package com.ssafy.d109.pubble.controller;

import com.ssafy.d109.pubble.dto.requestDto.UploadRequestDto;
import com.ssafy.d109.pubble.dto.responseDto.UploadResponseDto;
import com.ssafy.d109.pubble.service.FileService;
import com.ssafy.d109.pubble.service.ImageService;
import com.ssafy.d109.pubble.util.CommonUtil;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

@RestController
@RequestMapping("/uploads")
public class UploadController {

    private final ImageService imageService;
    private final FileService fileService;
    private final CommonUtil commonUtil;

    public UploadController(ImageService imageService, FileService fileService, CommonUtil commonUtil) {
        this.imageService = imageService;
        this.fileService = fileService;
        this.commonUtil = commonUtil;
    }

    @PostMapping("/image")
    public ResponseEntity<?> uploadImage(@RequestParam("upload") MultipartFile upload) throws IOException {

        Integer requestId = commonUtil.getUser().getUserId();

        UploadResponseDto responseDto = new UploadResponseDto();

        String s3Url = imageService.uploadImage(upload, requestId);
        if (s3Url == null) {
            responseDto.setMessage("Image Upload Failed");
            responseDto.setS3Url(null);
            responseDto.setData(false);
            return new ResponseEntity<>(responseDto, HttpStatus.BAD_REQUEST);
        }

        responseDto.setMessage("Image Upload Success");
        responseDto.setS3Url(s3Url);
        responseDto.setData(true);
        return new ResponseEntity<>(responseDto, HttpStatus.OK);
    }

    @PostMapping("/file")
    public ResponseEntity<?> uploadFile(@RequestParam("upload") MultipartFile upload) throws IOException {

        Integer requestId = commonUtil.getUser().getUserId();

        UploadResponseDto responseDto = new UploadResponseDto();

        String s3Url = fileService.uploadFile(upload, requestId);
        if (s3Url == null) {
            responseDto.setMessage("File Upload Failed");
            responseDto.setS3Url(null);
            responseDto.setData(false);
            return new ResponseEntity<>(responseDto, HttpStatus.BAD_REQUEST);
        }

        responseDto.setMessage("File Upload Success");
        responseDto.setS3Url(s3Url);
        responseDto.setData(true);
        return new ResponseEntity<>(responseDto, HttpStatus.OK);
    }

}

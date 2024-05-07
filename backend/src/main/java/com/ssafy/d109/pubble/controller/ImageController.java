package com.ssafy.d109.pubble.controller;

import com.ssafy.d109.pubble.dto.requestDto.ImageUploadRequestDto;
import com.ssafy.d109.pubble.dto.responseDto.ImageUploadResponseDto;
import com.ssafy.d109.pubble.service.ImageService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.multipart.MultipartRequest;

import java.io.IOException;

@RestController
//@RequestMapping("/api")
public class ImageController {

    private final ImageService imageService;

    public ImageController(ImageService imageService) {
        this.imageService = imageService;
    }

    @PostMapping("/image")
    public ResponseEntity<?> uploadImage(@ModelAttribute ImageUploadRequestDto dto, @RequestParam("upload") MultipartFile upload) throws IOException {

        Integer requestId = dto.getRequirementId();

        ImageUploadResponseDto responseDto = new ImageUploadResponseDto();

        String s3Url = imageService.uploadImage(upload, dto.getRequirementId());
        if (s3Url == null) {
            responseDto.setMessage("Image Upload Failed");
            responseDto.setData(false);
            return new ResponseEntity<>(responseDto, HttpStatus.BAD_REQUEST);
        }

        responseDto.setMessage("Image Upload Success");
        responseDto.setData(true);
        return new ResponseEntity<>(responseDto, HttpStatus.OK);
    }
}

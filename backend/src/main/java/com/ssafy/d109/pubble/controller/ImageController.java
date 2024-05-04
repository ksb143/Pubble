package com.ssafy.d109.pubble.controller;

import com.ssafy.d109.pubble.dto.requestDto.ImageUploadRequestDto;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api")
public class ImageController {

    @PostMapping("/image")
    public ResponseEntity<?> uploadImage(@RequestBody ImageUploadRequestDto dto) {

        Integer requestId = dto.getRequirementId();


        return null;
    }
}

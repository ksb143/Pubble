package com.ssafy.d109.pubble.controller;

import com.ssafy.d109.pubble.entity.Requirement;
import com.ssafy.d109.pubble.repository.RequirementRepository;
import com.ssafy.d109.pubble.service.PreviewService;
import com.ssafy.d109.pubble.service.RequirementService;
import lombok.extern.log4j.Log4j2;
import org.springframework.core.io.InputStreamResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.io.ByteArrayInputStream;
import java.util.List;

@RestController
@RequestMapping("/projects")
@Log4j2
public class PreviewController {

    private final PreviewService previewService;
    private final RequirementRepository requirementRepository;

    public PreviewController(PreviewService previewService, RequirementRepository requirementRepository) {
        this.previewService = previewService;
        this.requirementRepository = requirementRepository;
    }

    @GetMapping("/{projectId}/preview")
    public ResponseEntity<?> printPdf(@PathVariable Integer projectId) {

        List<Requirement> requirements = requirementRepository.findAllByProject_projectId(projectId);
        if (requirements.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        ByteArrayInputStream bis = previewService.requirementsToPdf(requirements);

        HttpHeaders headers = new HttpHeaders();
        headers.add("Content-Disposition", "inline; filename=requirements.pdf");

        return ResponseEntity.ok()
                .headers(headers)
                .contentType(MediaType.APPLICATION_PDF)
                .body(new InputStreamResource(bis));
    }
}

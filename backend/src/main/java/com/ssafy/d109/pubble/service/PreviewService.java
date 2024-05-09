package com.ssafy.d109.pubble.service;

import com.itextpdf.io.font.PdfEncodings;
import com.itextpdf.kernel.colors.DeviceRgb;
import com.itextpdf.kernel.font.PdfFont;
import com.itextpdf.kernel.font.PdfFontFactory;
import com.itextpdf.kernel.pdf.PdfDocument;
import com.itextpdf.kernel.pdf.PdfWriter;
import com.itextpdf.layout.Document;
import com.itextpdf.layout.element.Cell;
import com.itextpdf.layout.element.ListItem;
import com.itextpdf.layout.element.Paragraph;
import com.itextpdf.layout.element.Table;
import com.itextpdf.layout.property.TextAlignment;
import com.itextpdf.layout.property.UnitValue;
import com.itextpdf.layout.property.VerticalAlignment;
import com.ssafy.d109.pubble.entity.Requirement;
import org.springframework.core.io.ClassPathResource;
import org.springframework.stereotype.Service;

import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.io.InputStream;
import java.util.List;

@Service
public class PreviewService {

    private static final int MAX_CONTENT_LENGTH = 50;
    private static final String FONT_PATH = "/fonts/Pretendard-Regular.ttf";

    public ByteArrayInputStream requirementsToPdf(List<Requirement> requirements) {
        ByteArrayOutputStream out = new ByteArrayOutputStream();

        try(PdfWriter writer = new PdfWriter(out);
            PdfDocument pdf = new PdfDocument(writer);
            Document document = new Document(pdf)) {

            InputStream fontStream = new ClassPathResource(FONT_PATH).getInputStream();
            byte[] fontBytes = fontStream.readAllBytes();
            PdfFont font = PdfFontFactory.createFont(fontBytes, PdfEncodings.IDENTITY_H, true);
            document.setFont(font);

            float[] columnWidths = {1, 1, 2, 4, 4, 2};
            Table table = new Table(columnWidths);
            table.setWidth(UnitValue.createPercentValue(100));

            DeviceRgb lightGrey = new DeviceRgb(245, 245, 245);

            addHeaderCells(table, font, 10, lightGrey);
            for (Requirement requirement : requirements) {
                addCell(table, truncate(yesOrNo(requirement.getApproval())), font, 10);
                addCell(table, truncate(requirement.getCode()), font, 10);
                addCell(table, truncate(requirement.getRequirementName()), font, 10);
                addCell(table, truncate(requirement.getDetail()), font, 10);
                addCell(table, truncate(requirement.getManager().getName()), font, 10);
                addCell(table, truncate(requirement.getVersion()), font, 10);

            }

            document.add(table);
            document.close();

        } catch (Exception e) {
            throw new RuntimeException("Failed to create pdf", e);
        }

        return new ByteArrayInputStream(out.toByteArray());
    }

    private void addHeaderCells(Table table, PdfFont font, float minHeight, DeviceRgb backgroundColor) {
        String[] headers = {"승인 여부", "항목 ID", "요구사항 이름", "상세 설명", "요구사항 담당자", "현재 버전"};
        for (String header : headers) {
            Cell cell = new Cell()
                    .add(new Paragraph(header).setFont(font))
                    .setBackgroundColor(backgroundColor)
                    .setTextAlignment(TextAlignment.CENTER)
                    .setVerticalAlignment(VerticalAlignment.MIDDLE)
                    .setMinHeight(minHeight)
                    ;

            table.addHeaderCell(cell);
        }
    }

    private void addCell(Table table, String content, PdfFont font, float minHeight) {

        Cell cell = new Cell()
                .add(new Paragraph(content).setFont(font))
                .setTextAlignment(TextAlignment.CENTER)
                .setVerticalAlignment(VerticalAlignment.MIDDLE)
                .setMinHeight(minHeight);

        table.addCell(cell);
    }

    private String truncate(String content) {
        if (content.length() > MAX_CONTENT_LENGTH) {
            return content.substring(0, MAX_CONTENT_LENGTH - 3) + "...";
        }

        return content;
    }

    private String yesOrNo(String content) {
        if (content.equals("a") || content.equals("l")) {
            return "Y";
        }

        return "N";
    }



}

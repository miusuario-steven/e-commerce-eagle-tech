package com.eagletech.ecommerce.backend.usecases;

import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.UUID;

@Service
public class ImageStorageService {
    private static final String FOLDER = "src/main/resources/static/image/";
    private static final String TEMP_FOLDER = "src/main/resources/static/image/temp/";
    private static final String DEFAULT_IMAGE_NAME = "default.jpg";
    private static final String IMAGE_URL_BASE = "http://localhost:8085/image/";

    public ImageStorageService() {
        // Asegurarse de que los directorios existan al iniciar el servicio
        new File(FOLDER).mkdirs();
        new File(TEMP_FOLDER).mkdirs();
    }

    public String saveImageTemporarily(MultipartFile multipartFile) throws IOException {
        if (multipartFile == null || multipartFile.isEmpty()) {
            return null;
        }
        String originalFilename = multipartFile.getOriginalFilename();
        String extension = "";
        if (originalFilename != null && originalFilename.contains(".")) {
            extension = originalFilename.substring(originalFilename.lastIndexOf("."));
        }
        String newFileName = UUID.randomUUID().toString() + extension;

        Path tempPath = Paths.get(TEMP_FOLDER + newFileName);
        Files.copy(multipartFile.getInputStream(), tempPath, StandardCopyOption.REPLACE_EXISTING);
        return newFileName;
    }

    public void commitTemporaryImage(String tempFileName) throws IOException {
        if (tempFileName == null) return;
        Path source = Paths.get(TEMP_FOLDER + tempFileName);
        Path destination = Paths.get(FOLDER + tempFileName);
        Files.move(source, destination, StandardCopyOption.REPLACE_EXISTING);
    }

    public void deleteImage(String imageName) {
        if (imageName == null || imageName.equals(DEFAULT_IMAGE_NAME)) {
            return;
        }
        try {
            Files.deleteIfExists(Paths.get(FOLDER + imageName));
            Files.deleteIfExists(Paths.get(TEMP_FOLDER + imageName)); // Limpiar por si acaso
        } catch (IOException e) {
            // Log del error, pero no relanzar para no romper el flujo principal
            System.err.println("Error deleting image: " + imageName + " - " + e.getMessage());
        }
    }

    public String getImageNameFromUrl(String imageUrl) {
        if (imageUrl == null || !imageUrl.startsWith(IMAGE_URL_BASE)) {
            return null;
        }
        return imageUrl.substring(IMAGE_URL_BASE.length());
    }

    public String buildImageUrl(String fileName) {
        if (fileName == null) {
            return IMAGE_URL_BASE + DEFAULT_IMAGE_NAME;
        }
        return IMAGE_URL_BASE + fileName;
    }
}
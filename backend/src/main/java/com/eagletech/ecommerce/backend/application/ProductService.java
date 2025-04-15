package com.eagletech.ecommerce.backend.application;

import java.io.IOException;
import java.util.Optional;

import org.springframework.web.multipart.MultipartFile;

import com.eagletech.ecommerce.backend.domain.model.Product;
import com.eagletech.ecommerce.backend.domain.port.IProductRepository;

import lombok.extern.slf4j.Slf4j;

@Slf4j
public class ProductService {

    private final IProductRepository iProductRepository;
    private final UploadFile uploadFile;

    public ProductService(IProductRepository iProductRepository, UploadFile uploadFile) {
        this.iProductRepository = iProductRepository;
        this.uploadFile = uploadFile;
    }

    public Product save(Product product, MultipartFile multipartFile) throws IOException {
        // ✅ Genera el código automáticamente solo si es un nuevo producto
        if (product.getId() == null || product.getId() == 0) {
            product.setCode(generateProductCode());
        }

        // ✅ Manejo de la imagen
        if (product.getId() != null && product.getId() != 0) {
            // Producto existente → solo actualiza imagen si viene nueva
            if (multipartFile == null) {
                product.setUrlImage(product.getUrlImage());
            } else {
                product.setUrlImage(uploadFile.upload(multipartFile));
            }
        } else {
            // Producto nuevo → limpiar si no es default y subir nueva
            String urlImage = product.getUrlImage();
            if (urlImage != null && urlImage.length() >= 28) {
                String nameFile = urlImage.substring(28);
                if (!nameFile.equals("default.jpg")) {
                    uploadFile.delete(nameFile);
                }
            }
            product.setUrlImage(uploadFile.upload(multipartFile));
        }

        return this.iProductRepository.save(product);
    }

    // ✅ Generador automático de código
    private String generateProductCode() {
        Optional<Product> lastProduct = iProductRepository.findTopByOrderByIdDesc();
        int nextId = lastProduct.map(p -> p.getId() + 1).orElse(1);
        return String.format("PRD-%03d", nextId); // ej. PRD-001
    }

    public Iterable<Product> findALL() {
        return this.iProductRepository.findALL();
    }

    public Product findById(Integer id) {
        return this.iProductRepository.findById(id);
    }

    public void deleteById(Integer id) {
        Product product = findById(id);
        String urlImage = product.getUrlImage();
        if (urlImage != null && urlImage.length() >= 28) {
            String nameFile = urlImage.substring(28);
            log.info("Este es el nombre de la imagen: {}", nameFile);
            if (!nameFile.equals("default.jpg")) {
                uploadFile.delete(nameFile);
            }
        }
        this.iProductRepository.deleteById(id);
    }
}

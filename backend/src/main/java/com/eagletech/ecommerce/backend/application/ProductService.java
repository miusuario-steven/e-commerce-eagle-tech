package com.eagletech.ecommerce.backend.application;

import java.io.IOException;

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
        if (product.getId() != 0) { // cuando es un producto modificado 
            if (multipartFile == null) {
                product.setUrlImage(product.getUrlImage());
            } else {
                product.setUrlImage(uploadFile.upload(multipartFile));
            }
        } else {
            String urlImage = product.getUrlImage();
            if (urlImage != null && urlImage.length() >= 28) {
                String nameFile = urlImage.substring(28);
                log.info("Este es el nombre de la imagen: {}", nameFile);
                if (!nameFile.equals("default.jpg")) {
                    uploadFile.delete(nameFile);
                }
            }
            product.setUrlImage(uploadFile.upload(multipartFile));
        }

        return this.iProductRepository.save(product);
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

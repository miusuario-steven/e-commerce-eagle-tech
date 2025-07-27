package com.eagletech.ecommerce.backend.usecases;

import com.eagletech.ecommerce.backend.domain.model.Product;
import com.eagletech.ecommerce.backend.domain.port.IProductRepository;
import com.eagletech.ecommerce.backend.infrastructure.specifications.ProductSpecification;
import com.eagletech.ecommerce.backend.infrastructure.web.exceptions.ProductNotFoundException;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

@Slf4j
@AllArgsConstructor
@Service
public class ManageProductUseCase {

    private final IProductRepository productRepository;
    private final ImageStorageService imageStorageService;
    private final ProductSpecification spec;
    private final AfterCommitExecutor afterCommitExecutor;

    @Transactional
    public Product saveProduct(Product product, MultipartFile multipartFile) throws IOException {
        boolean isNewProduct = (product.getId() == null || product.getId() == 0);
        String oldImageName = isNewProduct ? null : getProductById(product.getId()).getUrlImage();

        // Guardar la nueva imagen temporalmente (si existe) y obtener su nombre
        String newImageFileName = (multipartFile != null && !multipartFile.isEmpty())
                ? imageStorageService.saveImageTemporarily(multipartFile)
                : null;

        if (newImageFileName != null) {
            product.setUrlImage(imageStorageService.buildImageUrl(newImageFileName));
        }

        Product savedProduct = this.productRepository.save(product);

        // Registrar las operaciones de archivo para que se ejecuten solo si la transacción tiene éxito
        afterCommitExecutor.execute(() -> {
            try {
                if (newImageFileName != null) {
                    imageStorageService.commitTemporaryImage(newImageFileName);
                    if (oldImageName != null) {
                        imageStorageService.deleteImage(imageStorageService.getImageNameFromUrl(oldImageName));
                    }
                }
            } catch (Exception e) {
                log.error("Error committing image operations after transaction", e);
                // Aquí se podría añadir lógica de compensación, como registrar el fallo en una cola
            }
        });

        return savedProduct;
    }

    @Transactional(readOnly = true)
    public Page<Product> getAllProducts(Pageable pageable) {
        return this.productRepository.findAll(pageable);
    }

    @Transactional(readOnly = true)
    public Page<Product> searchPublicProducts(Integer categoryId, String searchTerm, Double minPrice, Double maxPrice, Pageable pageable) {
        Specification<Product> specification = Specification.where(spec.hasCategory(categoryId))
                .and(spec.nameContaining(searchTerm))
                .and(spec.priceGreaterThanOrEqual(minPrice))
                .and(spec.priceLessThanOrEqual(maxPrice));
        return productRepository.findAll(specification, pageable);
    }

    @Transactional(readOnly = true)
    public Product getProductById(Integer id) {
        return this.productRepository.findById(id).orElseThrow(
                () -> new ProductNotFoundException("Product with id " + id + " not found.")
        );
    }

    @Transactional
    public void deleteProductById(Integer id) {
        Product product = getProductById(id);
        String imageName = (product.getUrlImage() != null && !product.getUrlImage().isEmpty())
                ? imageStorageService.getImageNameFromUrl(product.getUrlImage())
                : null;

        this.productRepository.deleteById(id);

        if (imageName != null) {
            afterCommitExecutor.execute(() -> {
                try {
                    imageStorageService.deleteImage(imageName);
                } catch (Exception e) {
                    log.error("Error deleting image {} after transaction", imageName, e);
                }
            });
        }
    }
}
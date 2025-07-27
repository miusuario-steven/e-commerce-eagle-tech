package com.eagletech.ecommerce.backend.infrastructure.service;

import java.util.ArrayList;
import java.util.List;
import java.util.Locale;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import org.springframework.beans.factory.annotation.Value;
import com.paypal.api.payments.Amount;
import com.paypal.api.payments.Payer;
import com.paypal.api.payments.Payment;
import com.paypal.api.payments.PaymentExecution;
import com.paypal.api.payments.RedirectUrls;
import com.paypal.api.payments.Transaction;
import com.paypal.base.rest.APIContext;
import com.paypal.base.rest.PayPalRESTException;

@Service
public class PaypalService {
    private static final Logger logger = LoggerFactory.getLogger(PaypalService.class);
    private final APIContext apiContext;

    @Value("${paypal.currency}")
    private String currency;

    @Value("${paypal.method}")
    private String method;

    @Value("${paypal.intent}")
    private String intent;

    @Value("${paypal.description}")
    private String description;

    @Value("${paypal.cancelUrl}")
    private String cancelUrl;

    @Value("${paypal.successUrl}")
    private String successUrl;

    public PaypalService(APIContext apiContext) {
        this.apiContext = apiContext;
    }

    public Payment createPayment(
        Double total
    ) throws PayPalRESTException {
        try {
            Amount amount = new Amount();
            amount.setCurrency(this.currency);
            amount.setTotal(String.format(Locale.forLanguageTag(this.currency), "%.2f", total));

            Transaction transaction = new Transaction();
            transaction.setDescription(this.description);
            transaction.setAmount(amount);

            List<Transaction> transactions = new ArrayList<>();
            transactions.add(transaction);

            Payer payer = new Payer();
            payer.setPaymentMethod(this.method);

            Payment payment = new Payment();
            payment.setIntent(this.intent);
            payment.setPayer(payer);
            payment.setTransactions(transactions);

            RedirectUrls redirectUrls = new RedirectUrls();
            redirectUrls.setReturnUrl(this.successUrl);
            redirectUrls.setCancelUrl(this.cancelUrl);
            payment.setRedirectUrls(redirectUrls);

            return payment.create(apiContext);
        } catch (PayPalRESTException e) {
            logger.error("Error occurred during payment creation: ", e);
            throw e;
        }
    }

    public Payment executePayment(String paymentId, String payerId) throws PayPalRESTException {
        try {
            Payment payment = new Payment();
            payment.setId(paymentId);

            PaymentExecution paymentExecution = new PaymentExecution();
            paymentExecution.setPayerId(payerId);

            return payment.execute(apiContext, paymentExecution);
        } catch (PayPalRESTException e) {
            logger.error("Error occurred during payment execution: ", e);
            throw e;
        }
    }
}

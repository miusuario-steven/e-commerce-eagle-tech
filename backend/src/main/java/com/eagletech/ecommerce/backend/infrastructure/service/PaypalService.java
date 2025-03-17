package com.eagletech.ecommerce.backend.infrastructure.service;

import java.util.ArrayList;
import java.util.List;
import java.util.Locale;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

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

    public PaypalService(APIContext apiContext) {
        this.apiContext = apiContext;
    }

    public Payment createPayment(
        Double total,
        String currency,
        String method,
        String intent,
        String description,
        String cancelUrl,
        String successUrl
    ) throws PayPalRESTException {
        try {
            Amount amount = new Amount();
            amount.setCurrency(currency);
            amount.setTotal(String.format(Locale.forLanguageTag(currency), "%.2f", total));

            Transaction transaction = new Transaction();
            transaction.setDescription(description);
            transaction.setAmount(amount);

            List<Transaction> transactions = new ArrayList<>();
            transactions.add(transaction);

            Payer payer = new Payer();
            payer.setPaymentMethod(method);

            Payment payment = new Payment();
            payment.setIntent(intent);
            payment.setPayer(payer);
            payment.setTransactions(transactions);

            RedirectUrls redirectUrls = new RedirectUrls();
            redirectUrls.setReturnUrl(successUrl);
            redirectUrls.setCancelUrl(cancelUrl);
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

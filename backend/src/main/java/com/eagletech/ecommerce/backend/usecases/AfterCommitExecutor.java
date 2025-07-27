package com.eagletech.ecommerce.backend.usecases;

import org.springframework.stereotype.Component;
import org.springframework.transaction.support.TransactionSynchronization;
import org.springframework.transaction.support.TransactionSynchronizationManager;

@Component
public class AfterCommitExecutor implements TransactionSynchronization {

    private final ThreadLocal<Runnable> tasks = new ThreadLocal<>();

    public void execute(Runnable task) {
        if (!TransactionSynchronizationManager.isSynchronizationActive()) {
            task.run();
            return;
        }
        tasks.set(task);
        TransactionSynchronizationManager.registerSynchronization(this);
    }

    @Override
    public void afterCommit() {
        Runnable task = tasks.get();
        if (task != null) {
            task.run();
        }
    }

    @Override
    public void afterCompletion(int status) {
        tasks.remove();
    }
}

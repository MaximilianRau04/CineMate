package com.cinemate.exceptions;

public class AlreadyInWatchlistException extends RuntimeException {
    public AlreadyInWatchlistException(String message) {
        super(message);
    }
}

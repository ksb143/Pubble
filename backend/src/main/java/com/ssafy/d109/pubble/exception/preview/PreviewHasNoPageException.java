package com.ssafy.d109.pubble.exception.preview;

public class PreviewHasNoPageException extends RuntimeException{

    public PreviewHasNoPageException(){
        super("The document has no pages");
    }
}

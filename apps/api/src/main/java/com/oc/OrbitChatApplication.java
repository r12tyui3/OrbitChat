// Author: Ritika Singh
package com.oc;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableScheduling
public class OrbitChatApplication {

    public static void main(String[] args) {
        SpringApplication.run(OrbitChatApplication.class, args);
    }

}
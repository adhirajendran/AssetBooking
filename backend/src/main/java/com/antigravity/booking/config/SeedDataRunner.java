package com.antigravity.booking.config;

import com.antigravity.booking.model.*;
import com.antigravity.booking.repository.AssetRepository;
import com.antigravity.booking.repository.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.List;

@Configuration
public class SeedDataRunner {

    @Bean
    public CommandLineRunner initData(UserRepository userRepository, AssetRepository assetRepository) {
        return args -> {
            if (userRepository.count() == 0) {
                User admin = User.builder().name("Admin").email("admin@company.com").password("admin").role(Role.ADMIN).build();
                User user1 = User.builder().name("John Doe").email("john@company.com").password("pass").role(Role.EMPLOYEE).build();
                User user2 = User.builder().name("Jane Smith").email("jane@company.com").password("pass").role(Role.EMPLOYEE).build();
                userRepository.saveAll(List.of(admin, user1, user2));
            }

            if (assetRepository.count() == 0) {
                Asset desk1 = Asset.builder().name("Hot Desk 1").type(AssetType.DESK).location("Floor 1").active(true).requiresApproval(false).build();
                Asset desk2 = Asset.builder().name("Hot Desk 2").type(AssetType.DESK).location("Floor 1").active(true).requiresApproval(false).build();
                Asset room1 = Asset.builder().name("Conference Room A").type(AssetType.MEETING_ROOM).location("Floor 2").active(true).requiresApproval(true).build();
                Asset laptop = Asset.builder().name("MacBook Pro 16\"").type(AssetType.LAPTOP).location("IT Dept").active(true).requiresApproval(true).build();
                assetRepository.saveAll(List.of(desk1, desk2, room1, laptop));
            }
        };
    }
}

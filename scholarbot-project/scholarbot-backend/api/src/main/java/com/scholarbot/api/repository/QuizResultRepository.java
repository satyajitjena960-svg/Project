package com.scholarbot.api.repository;

import com.scholarbot.api.domain.QuizResult;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface QuizResultRepository extends JpaRepository<QuizResult, Long> {
    // Fetches past quiz performance ordered by newest first
    List<QuizResult> findByUserIdOrderByDateTakenDesc(Long userId);
}
package com.scholarbot.api.repository;

import com.scholarbot.api.domain.SyllabusItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface SyllabusItemRepository extends JpaRepository<SyllabusItem, Long> {
    List<SyllabusItem> findByUserId(Long userId);
}
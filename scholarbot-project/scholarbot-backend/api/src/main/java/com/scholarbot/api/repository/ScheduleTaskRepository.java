package com.scholarbot.api.repository;

import com.scholarbot.api.domain.ScheduleTask;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface ScheduleTaskRepository extends JpaRepository<ScheduleTask, Long> {
    List<ScheduleTask> findByUserId(Long userId);
}
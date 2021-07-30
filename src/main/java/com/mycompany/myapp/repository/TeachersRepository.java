package com.mycompany.myapp.repository;

import com.mycompany.myapp.domain.Teachers;
import java.util.List;
import java.util.Optional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.*;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

/**
 * Spring Data SQL repository for the Teachers entity.
 */
@Repository
public interface TeachersRepository extends JpaRepository<Teachers, Long> {
    @Query(
        value = "select distinct teachers from Teachers teachers left join fetch teachers.courses",
        countQuery = "select count(distinct teachers) from Teachers teachers"
    )
    Page<Teachers> findAllWithEagerRelationships(Pageable pageable);

    @Query("select distinct teachers from Teachers teachers left join fetch teachers.courses")
    List<Teachers> findAllWithEagerRelationships();

    @Query("select teachers from Teachers teachers left join fetch teachers.courses where teachers.id =:id")
    Optional<Teachers> findOneWithEagerRelationships(@Param("id") Long id);
}

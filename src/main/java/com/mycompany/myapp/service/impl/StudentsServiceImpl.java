package com.mycompany.myapp.service.impl;

import com.mycompany.myapp.domain.Students;
import com.mycompany.myapp.domain.User;
import com.mycompany.myapp.repository.StudentsRepository;
import com.mycompany.myapp.service.StudentsService;
import java.util.Optional;

import com.mycompany.myapp.service.dto.AdminUserDTO;
import com.mycompany.myapp.service.dto.StudentDto;
import com.mycompany.myapp.service.dto.UserDTO;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Service Implementation for managing {@link Students}.
 */
@Service
@Transactional
public class StudentsServiceImpl implements StudentsService {

    private final Logger log = LoggerFactory.getLogger(StudentsServiceImpl.class);

    private final StudentsRepository studentsRepository;

    public StudentsServiceImpl(StudentsRepository studentsRepository) {
        this.studentsRepository = studentsRepository;
    }

    @Override
    public Students save(Students students) {
        log.debug("Request to save Students : {}", students);
        return studentsRepository.save(students);
    }

    @Override
    public Optional<Students> partialUpdate(Students students) {
        log.debug("Request to partially update Students : {}", students);

        return studentsRepository
            .findById(students.getId())
            .map(
                existingStudents -> {
                    if (students.getFirstName() != null) {
                        existingStudents.setFirstName(students.getFirstName());
                    }
                    if (students.getLastName() != null) {
                        existingStudents.setLastName(students.getLastName());
                    }
                    if (students.getPhone() != null) {
                        existingStudents.setPhone(students.getPhone());
                    }

                    return existingStudents;
                }
            )
            .map(studentsRepository::save);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<Students> findAll(Pageable pageable) {
        log.debug("Request to get all Students");
        return studentsRepository.findAll(pageable);
    }

    public Page<Students> findAllWithEagerRelationships(Pageable pageable) {
        return studentsRepository.findAllWithEagerRelationships(pageable);
    }

    @Override
    @Transactional(readOnly = true)
    public Optional<Students> findOne(Long id) {
        log.debug("Request to get Students : {}", id);
        return studentsRepository.findOneWithEagerRelationships(id);
    }

    @Override
    public void delete(Long id) {
        log.debug("Request to delete Students : {}", id);
        studentsRepository.deleteById(id);
    }

    @Override
    public Students createStudent(User user, String phone) {
        Students students = new Students();
        students.setFirstName(user.getFirstName());
        students.setLastName(user.getLastName());
       students.setPhone(phone);
       students.setUser(user);
       return studentsRepository.save(students);


    }
}

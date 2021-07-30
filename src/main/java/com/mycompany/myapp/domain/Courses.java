package com.mycompany.myapp.domain;

import java.io.Serializable;
import javax.persistence.*;

/**
 * A Courses.
 */
@Entity
@Table(name = "courses")
public class Courses implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    private Long id;

    @Column(name = "course_name")
    private String courseName;

    @Column(name = "credit_hour")
    private Integer creditHour;

    // jhipster-needle-entity-add-field - JHipster will add fields here
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Courses id(Long id) {
        this.id = id;
        return this;
    }

    public String getCourseName() {
        return this.courseName;
    }

    public Courses courseName(String courseName) {
        this.courseName = courseName;
        return this;
    }

    public void setCourseName(String courseName) {
        this.courseName = courseName;
    }

    public Integer getCreditHour() {
        return this.creditHour;
    }

    public Courses creditHour(Integer creditHour) {
        this.creditHour = creditHour;
        return this;
    }

    public void setCreditHour(Integer creditHour) {
        this.creditHour = creditHour;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Courses)) {
            return false;
        }
        return id != null && id.equals(((Courses) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "Courses{" +
            "id=" + getId() +
            ", courseName='" + getCourseName() + "'" +
            ", creditHour=" + getCreditHour() +
            "}";
    }
}

package com.mycompany.myapp.service.dto;

import com.mycompany.myapp.web.rest.vm.ManagedUserVM;

public class StudentDto extends ManagedUserVM {

   String phone;

    public StudentDto() {
    }

    public String getPhone() {
        return phone;
    }

    public void setPhone(String phone) {
        this.phone = phone;
    }
}

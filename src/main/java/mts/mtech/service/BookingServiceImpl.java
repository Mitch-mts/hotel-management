package mts.mtech.service;

import mts.mtech.dto.BookingDto;
import org.camunda.bpm.engine.RuntimeService;
import org.camunda.bpm.engine.runtime.ProcessInstance;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;

@Service
public class BookingServiceImpl implements BookingService{
    private RuntimeService runtimeService;

    @Override
    public void bookingService(BookingDto request) {
        Map<String, Object> variables = new HashMap<>();
        variables.put("idNumber", request.getIdNumber());
        variables.put("name", request.getName());
        variables.put("amount", request.getAmount());
        variables.put("roomType", request.getRoomType());
        variables.put("daysOfStay", request.getDaysOfStay());
        variables.put("age", request.getAge());


        runtimeService.createProcessInstanceByKey("BookingProcessId")
                .setVariables(variables)
                .startBeforeActivity("StartEvent_1")
                .execute();
    }
}

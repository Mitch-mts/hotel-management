package mts.mtech.service;

import lombok.extern.slf4j.Slf4j;
import mts.mtech.dto.BookingDto;
import org.camunda.bpm.engine.RuntimeService;
import org.camunda.bpm.engine.runtime.ProcessInstance;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;

@Service
@Slf4j
public class BookingServiceImpl implements BookingService{
    private final RuntimeService runtimeService;

    public BookingServiceImpl(RuntimeService runtimeService) {
        this.runtimeService = runtimeService;
    }

    @Override
    public void bookingService(BookingDto request) {
        log.info("booking request-----{}", request);
        Map<String, Object> variables = new HashMap<>();
        variables.put("idNumber", request.getIdNumber());
        variables.put("name", request.getName());
        variables.put("amount", request.getAmount());
        variables.put("roomType", request.getRoomType());
        variables.put("daysOfStay", request.getDaysOfStay());
        variables.put("age", request.getAge());

        log.info("mapped variables---->{}", variables);


        runtimeService.createProcessInstanceByKey("BookingProcessId")
                .setVariables(variables)
                .startBeforeActivity("StartEvent_1")
                .execute();
    }
}

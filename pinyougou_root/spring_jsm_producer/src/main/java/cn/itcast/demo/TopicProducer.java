package cn.itcast.demo;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jms.core.JmsTemplate;
import org.springframework.stereotype.Component;

import javax.jms.Destination;

@Component
public class TopicProducer {
    @Autowired
    private JmsTemplate jmsTemplate;

    @Autowired
    private Destination topicTextDestination;

    /*    public void sendTextMessage(final String text) {
            jmsTemplate.send(topicTextDestination, new MessageCreator() {
                public Message createMessage(Session session) throws JMSException {
                    return session.createTextMessage(text);
                }
            });
        }*/
    public void sendTextMessage(String text) {
        jmsTemplate.send(topicTextDestination, (session -> session.createTextMessage(text)));
    }
}

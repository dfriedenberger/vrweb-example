package de.frittenburger.vr.controller;

import java.util.Map;

import javax.servlet.http.HttpServletRequest;

import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;



@Controller
public class PageController {

 
	private static final Logger logger = LogManager.getLogger(PageController.class);

	
	
	@RequestMapping("/")
	public String welcome(@RequestHeader Map<String, String> headers, Map<String, Object> model, HttpServletRequest request) {
		
	    headers.forEach((key, value) -> {
	    	logger.info(String.format("Header '%s' = %s", key, value));
	    });
	    
	    model.put("header", "VR-Web Examples");
	    model.put("message", "Eine Übersicht an Beispielen.");
	    
		return "welcome";
	}
	
	@RequestMapping("/vrscene/{id}")
	public String vrscene(@PathVariable("id") String id, HttpServletRequest request) {
		
	 
	    
		return "vrscene";
	}
	
	@RequestMapping("/panorama/{id}")
	public String panorama(@PathVariable("id") String id, HttpServletRequest request) {
		
	 
	    
		return "panorama";
	}
	
	
	
	
	
}
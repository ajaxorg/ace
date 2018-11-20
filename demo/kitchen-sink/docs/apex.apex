public class testBlockDuplicatesLeadTrigger {
	
	static testMethod void testDuplicateTrigger(){  
	
		Lead[] l1 =new Lead[]{
			new Lead(  Email='homer@fox.tv', LastName='Simpson', Company='fox' )
		};
		insert l1;		// add a known lead
		
		Lead[] l2 =new Lead[]{
			new Lead(  Email='homer@fox.tv', LastName='Simpson', Company='fox' )
		};
		// try to add a matching lead
		try {	insert l2;	} catch ( System.DmlException e) { 
			system.assert(e.getMessage().contains('first error: FIELD_CUSTOM_VALIDATION_EXCEPTION, A lead with this email address already exists'),
			 e.getMessage());
		}
		
		// test duplicates in the same batch
		Lead[] l3 =new Lead[]{
			new Lead(  Email='marge@fox.tv', LastName='Simpson', Company='fox' ),
			new Lead(  Email='marge@fox.tv', LastName='Simpson', Company='fox' )
		};		
		try { insert l3;	} catch ( System.DmlException e) { 
			system.assert(e.getMessage().contains('first error: FIELD_CUSTOM_VALIDATION_EXCEPTION, Another new lead has the same email'),
				e.getMessage());
			
		}
		
		// test update also
		Lead[] lup = new Lead[]{
			new Lead(  Email='marge@fox.tv',  LastName='Simpson', Company='fox' )
		};
		insert lup;
		Lead marge = [ select id,Email from lead where Email = 'marge@fox.tv' limit 1];
		system.assert(marge!=null);
		marge.Email = 'homer@fox.tv'; 
		
		try { update marge; } catch ( System.DmlException e) { 
			system.assert(e.getMessage().contains('irst error: FIELD_CUSTOM_VALIDATION_EXCEPTION, A lead with this email address already exists'),
				e.getMessage());	
		}
	}
}
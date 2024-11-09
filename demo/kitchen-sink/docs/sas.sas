/* Define Oracle connection details */
%let oracle_path=oracle_server_path;
%let schema=YOUR_SCHEMA;
libname dwh oracle user=&schema password="{SAS-ENCRYPTED}" 
	path="&oracle_path" schema=&schema;

/* Macro to calculate sales metrics by region */
%macro calc_sales_metrics(year=, outdsn=);
	%if %upcase(&request)=STAT %then
		%do;
			proc means;
				title "Summary of All Numeric Variables";
			run;
		%end;
	%else %if %upcase(&request)=PRINTIT %then
		%do;
			proc print;
				title "Listing of Data";
			run;
		%end;
	%else %put Incorrect report type. Please try again.;

	%do i=1 %to &howmany;
		data month&i;
			infile in&i;
			input product cost date;
		run;
	%end;

	data _null_;
		do i=1 to 4;
			put ;
		end;
		do until(n>=5);
			put n=;
			n+1;
		end;
		do while(n<5);
			put n=;
			n+1;
		end;

		select (a);
			when (1) x=x*10;
			when (2);
			when (3,4,5) x=x*100;
			otherwise put;
		end;

		if x then delete;
		if status='OK' and type=3 then count+1;
		if age ne agecheck then delete;
		if x=0 then  
		if y ne 0 then put 'X ZERO, Y NONZERO'; 
		else put 'X ZERO, Y ZERO';
		else put 'X NONZERO';
		if answer=9 then
			do;
				answer=.;
				put 'INVALID ANSWER FOR ' id=;
			end;
		else
			do;
				answer=answer10;
				valid+1;
			end;
	run;

	/* Extract base sales data from Oracle */
    proc sql;
        connect to oracle (user=&schema password="{SAS-ENCRYPTED}" 
            path="&oracle_path");
        create table work.raw_sales as
        select * from connection to oracle
        (
            SELECT 
                r.REGION_NAME,
                p.PRODUCT_CATEGORY,
                s.SALE_DATE,
                s.QUANTITY,
                s.UNIT_PRICE,
                s.DISCOUNT
            FROM 
                SALES s
                JOIN REGIONS r ON s.REGION_ID = r.REGION_ID
                JOIN PRODUCTS p ON s.PRODUCT_ID = p.PRODUCT_ID
            WHERE 
                EXTRACT(YEAR FROM s.SALE_DATE) = &year
        );
        disconnect from oracle;
    quit;

    /* Create monthly aggregates using data step */
    data work.monthly_sales;
        set work.raw_sales;
        sale_month = month(sale_date);
        revenue = quantity * unit_price * (1 - discount);
        format sale_date date9. revenue dollar12.2;
    run;

    /* Sort data for subsequent processing */
    proc sort data=work.monthly_sales;
        by region_name product_category sale_month;
    run;

    /* Calculate summary statistics using proc means */
    proc means data=work.monthly_sales noprint;
        class region_name product_category sale_month;
        var quantity revenue;
        output out=&outdsn
            sum(quantity)=total_quantity
            sum(revenue)=total_revenue
            mean(revenue)=avg_revenue
            std(revenue)=std_revenue;
    run;

    /* Add trend calculations */
    proc expand data=&outdsn out=&outdsn(drop=_: WHERE=(_TYPE_ = 7));
        by region_name product_category;
        id sale_month;
        convert total_revenue = revenue_ma / transformout=(mov 3);
    run;

    /* Format final output */
    data &outdsn;
        set &outdsn;
        format total_revenue avg_revenue revenue_ma dollar12.2
               total_quantity comma8.;
        label 
            total_quantity = "Total Units Sold"
            total_revenue = "Total Revenue"
            avg_revenue = "Average Revenue"
            revenue_ma = "3-Month Moving Average Revenue"
            std_revenue = "Revenue Standard Deviation";
    run;
%mend calc_sales_metrics;

/* Example usage of the macro */
%calc_sales_metrics(year=2023, outdsn=work.sales_metrics_2023);

/* Create summary report */
proc report data=work.sales_metrics_2023;
    column region_name product_category total_quantity total_revenue revenue_ma;
    define region_name / group "Region";
    define product_category / group "Product Category";
    define total_quantity / analysis sum "Total Units";
    define total_revenue / analysis sum "Total Revenue";
    define revenue_ma / analysis mean "3-Month Moving Average";
    
    compute after region_name;
        line ' ';
    endcomp;
run;
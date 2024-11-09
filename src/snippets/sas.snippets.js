module.exports = `snippet datastep
	data \$1;
	    \$2
	run;

snippet datanull
	data _null_;
	    \$1
	run;

snippet commentline
	*---------------------------------------------- \$1 ------------------------------------------------;
snippet commentsection
	*--------------------------------------------------------------------------------------------------;
	*                                           \$1
	*--------------------------------------------------------------------------------------------------;
snippet fmt
	proc format;
	    value \${1:txtfmt}
	    "\$2" = "\$3"
	    "\$4" = "\$5"
	    "\$6" = "\$7"
	    ;
	run;

snippet sql
	proc sql;
	    create table \$1 as
	    select \$2
	    from \$3
		where 1=1
			and \$4
		order by \$5
		;
	quit;

snippet do
	do i=\$1 to \$2;
		\$3;
	end;

snippet dountil
	do until (\${1:condition});
		\$2;
	end;

snippet dowhile
	do while (\${1:condition});
		\$2;
	end;

snippet select
	select (\${1:expression});
		when (\$2) \$3;
		when (\$4) \$5;
		otherwise \$6;
	end;

snippet if-then-else
	if \${1:condition} then \$2;
	else \$3;

snippet %macro
	%macro \${1:macro_name}(\${2:arg},\${3:kwarg}=\$4);
		\$5;
	%mend \$1;

snippet %let
	%let \${1:macro_variable}=\${2:value};

snippet %mput
	%put &\${1:macro_variable}.;

snippet %mput-error
	%put ERROR: \${1:error message};

snippet %mput-note
	%put NOTE: \${1:message};

snippet %mput-warning
	%put WARNING: \${1:message};

snippet %mif-then-else
	%if \${1:condition} %then %do;
		\$2;
	%end;
	%else %do;
		\$3;
	%end;

snippet %mdo
	%do i=\$1 %to \$2;
		\$3;
	%end;

snippet %mdountil
	%do %until (\${1:condition});
		\$2;
	%end;

snippet %mdowhile
	%do %while (\${1:condition});
		\$2;
	%end;

snippet contents
	proc contents data=\$1;
	run;

snippet datasets
	proc datasets lib=\$1 memtype=data nolist nodetails kill
	run;
quit;

snippet import xlsx
	proc import
	    datafile="\$1"
	    out=\$2
	    dbms=xlsx replace
	    sheet="\$3";
	run;

snippet import csv
	proc import
	    datafile="\$1"
	    out=\$2
	    dbms=csv replace;
	run;

snippet export
	proc export data=\$1 outfile="\$2" dbms=\$3 replace;
	    putnames=no;
	run;

snippet tabulate
	proc tabulate data=\$1 format=\$2;
		class \$3;
		var \$4;
		table \$5;
		format \$6;
		title \$7;
	run;

snippet print
	proc print data=\$1;
	run;

snippet sort
	proc sort data=\$1;
		by \$2;
	run;

snippet rank
	proc rank data=\$1 out=\$2;
	    var \$3;
	    ranks \$4;
	run;

snippet freq
	proc freq data=\$1;
	    tables \$2/nocol nocum norow;
	run;

snippet corr
	proc corr data=\$1;
	    var \$2;
	run;

snippet univariate
	proc univariate data=\$1 noprint;
	    var \$2;
	run;

snippet anova
	proc anova data=\$1;
	    class \$2;
	    model \$3;
	run;

snippet cluster
	proc cluster data=\$1 method=\${2|average,centroid,complete,density,eml,flexible,mcquitty,median,single,twostage,ward|};
	    var \$3;
	    id \$4;
	run;

snippet factor
	proc factor data=\$1 simple corr;
	run;

snippet surveyselect
	proc surveyselect data=\$1 out=\$2 method=\${3|bernoulli,poisson,pps,brewer,murthy,sampford,chromy,chromy,srs,urs|};
	    strata \$4;
	run;

snippet reg
	proc reg data=\$1;
	    model \$2;
	run;

snippet logistic
	proc logistic data=\$1;
	    class \$2;
	    model \$3;
	run;

snippet transpose
	proc transpose data=\$1 out=\$2;
	    by \$3;
	    var \$4;
	run;

snippet lifetest
	proc lifetest data=\$1 outtest=\$2;
	    time \$3;
	    strata \$4;
	run;

snippet fastclus
	proc fastclus data=\$1 out=\$2 maxc=\$3 maxiter=\$4;
	    var \$5;
	run;

snippet glm
	proc glm data=\$1;
	    class \$2;
	    model \$3;
	run;

snippet mixed
	proc mixed data=\$1;
	    class \$2;
	    model \$3;
	    random \$4;
	run;

snippet npar1way
	proc npar1way data=\$1;
	    class \$2;
	    var \$3;
	run;

snippet ttest
	proc ttest data=\$1;
	    class \$2;
	    var \$3;
	run;

snippet sgrender
	proc sgrender data=\$1 template=\$2;
	run;

snippet abs
	abs(\${1})
snippet anyalnum
	anyalnum(\${1})
snippet anyalpha
	anyalpha(\${1})
snippet anycntrl
	anycntrl(\${1})
snippet anydigit
	anydigit(\${1})
snippet anyprint
	anyprint(\${1})
snippet anypunct
	anypunct(\${1})
snippet anyspace
	anyspace(\${1})
snippet anyupper
	anyupper(\${1})
snippet attrc
	attrc(\${1})
snippet attrn
	attrn(\${1})
snippet cat
	cat(\${1})
snippet catq
	catq(\${1})
snippet cats
	cats(\${1})
snippet catt
	catt(\${1})
snippet catx
	catx(\${1})
snippet ceil
	ceil(\${1})
snippet cmiss
	cmiss(\${1})
snippet coalesce
	coalesce(\${1})
snippet coalescec
	coalescec(\${1})
snippet compare
	compare(\${1})
snippet compbl
	compbl(\${1})
snippet compged
	compged(\${1})
snippet complev
	complev(\${1})
snippet compress
	compress(\${1})
snippet count
	count(\${1})
snippet countc
	countc(\${1})
snippet countw
	countw(\${1})
snippet date
	date(\${1})
snippet datetime
	datetime(\${1})
snippet day
	day(\${1})
snippet dsname
	dsname(\${1})
snippet exist
	exist(\${1})
snippet exp
	exp(\${1})
snippet fetch
	fetch(\${1})
snippet fileexist
	fileexist(\${1})
snippet filename
	filename(\${1})
snippet fileref
	fileref(\${1})
snippet find
	find(\${1})
snippet findc
	findc(\${1})
snippet findw
	findw(\${1})
snippet finfo
	finfo(\${1})
snippet finv
	finv(\${1})
snippet floor
	floor(\${1})
snippet floorz
	floorz(\${1})
snippet fopen
	fopen(\${1})
snippet hour
	hour(\${1})
snippet ifc
	ifc(\${1})
snippet ifn
	ifn(\${1})
snippet index
	index(\${1})
snippet indexc
	indexc(\${1})
snippet indexw
	indexw(\${1})
snippet input
	input(\${1})
snippet inputc
	inputc(\${1})
snippet inputn
	inputn(\${1})
snippet int
	int(\${1})
snippet intck
	intck(\${1})
snippet intnx
	intnx(\${1})
snippet is8601_convert
	call is8601_convert(\${1})
snippet left
	left(\${1})
snippet length
	length(\${1})
snippet lengthc
	lengthc(\${1})
snippet lengthm
	lengthm(\${1})
snippet lengthn
	lengthn(\${1})
snippet log
	log(\${1})
snippet log10
	log10(\${1})
snippet log1px
	log1px(\${1})
snippet log2
	log2(\${1})
snippet logbeta
	logbeta(\${1})
snippet max
	max(\${1})
snippet mdy
	mdy(\${1})
snippet mean
	mean(\${1})
snippet median
	median(\${1})
snippet min
	min(\${1})
snippet minute
	minute(\${1})
snippet missing
	call missing(\${1})
snippet missing2
	missing(\${1})
snippet mod
	mod(\${1})
snippet n
	n(\${1})
snippet nmiss
	nmiss(\${1})
snippet open
	open(\${1})
snippet ordinal
	ordinal(\${1})
snippet propcase
	propcase(\${1})
snippet prxchange2
	call prxchange(\${1})
snippet prxchange
	prxchange(\${1})
snippet prxdebug
	call prxdebug(\${1})
snippet prxfree
	call prxfree(\${1})
snippet prxmatch
	prxmatch(\${1})
snippet prxnext
	call prxnext(\${1})
snippet prxparen
	prxparen(\${1})
snippet prxparse
	prxparse(\${1})
snippet prxposn2
	call prxposn(\${1})
snippet prxposn
	prxposn(\${1})
snippet prxsubstr
	call prxsubstr(\${1})
snippet ptrlongadd
	ptrlongadd(\${1})
snippet put
	put(\${1})
snippet putc
	putc(\${1})
snippet putn
	putn(\${1})
snippet rank
	rank(\${1})
snippet ranuni
	ranuni(\${1})
snippet rename
	rename(\${1})
snippet round
	round(\${1})
snippet rounde
	rounde(\${1})
snippet roundz
	roundz(\${1})
snippet saving
	saving(\${1})
snippet scan2
	call scan(\${1})
snippet scan
	scan(\${1})
snippet sortc
	call sortc(\${1})
snippet sortn
	call sortn(\${1})
snippet soundex
	soundex(\${1})
snippet spedis
	spedis(\${1})
snippet sqrt
	sqrt(\${1})
snippet std
	std(\${1})
snippet stderr
	stderr(\${1})
snippet strip
	strip(\${1})
snippet substr
	substr(\${1})
snippet substrn
	substrn(\${1})
snippet sum
	sum(\${1})
snippet symget
	symget(\${1})
snippet symglobl
	symglobl(\${1})
snippet symlocal
	symlocal(\${1})
snippet symput
	call symput(\${1})
snippet symputx
	call symputx(\${1})
snippet sysexist
	sysexist(\${1})
snippet sysget
	sysget(\${1})
snippet today
	today(\${1})
snippet translate
	translate(\${1})
snippet transtrn
	transtrn(\${1})
snippet tranwrd
	tranwrd(\${1})
snippet trim
	trim(\${1})
snippet trimn
	trimn(\${1})
snippet trunc
	trunc(\${1})
snippet upcase
	upcase(\${1})
snippet varlen
	varlen(\${1})
snippet varname
	varname(\${1})
snippet varnum
	varnum(\${1})
snippet varray
	varray(\${1})
snippet varrayx
	varrayx(\${1})
snippet vartype
	vartype(\${1})
snippet verify
	verify(\${1})
snippet vformat
	vformat(\${1})
snippet vformatd
	vformatd(\${1})
snippet vformatdx
	vformatdx(\${1})
snippet vformatn
	vformatn(\${1})
snippet vformatnx
	vformatnx(\${1})
snippet vformatw
	vformatw(\${1})
snippet vformatwx
	vformatwx(\${1})
snippet vformatx
	vformatx(\${1})
snippet vinarray
	vinarray(\${1})
snippet vinarrayx
	vinarrayx(\${1})
snippet vinformat
	vinformat(\${1})
snippet vinformatd
	vinformatd(\${1})
snippet vinformatdx
	vinformatdx(\${1})
snippet vinformatn
	vinformatn(\${1})
snippet vinformatnx
	vinformatnx(\${1})
snippet vinformatw
	vinformatw(\${1})
snippet vinformatwx
	vinformatwx(\${1})
snippet vinformatx
	vinformatx(\${1})
snippet vlabel
	vlabel(\${1})
snippet vlabelx
	vlabelx(\${1})
snippet vlength
	vlength(\${1})
snippet vlengthx
	vlengthx(\${1})
snippet vname2
	call vname(\${1})
snippet vname
	vname(\${1})
snippet vnamex
	vnamex(\${1})
snippet vnext
	call vnext(\${1})
snippet vtype
	vtype(\${1})
snippet vtypex
	vtypex(\${1})
snippet vvalue
	vvalue(\${1})
snippet vvaluex
	vvaluex(\${1})
snippet week
	week(\${1})
snippet weekday
	weekday(\${1})
snippet whichc
	whichc(\${1})
snippet whichn
	whichn(\${1})
snippet year
	year(\${1})
snippet yieldp
	yieldp(\${1})
snippet yrdif
	yrdif(\${1})
`
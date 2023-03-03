create table t (
    id integer, 
    month varchar(3), 
    value integer
);

insert into t (month, value) values ('jan', 1);
insert into t (month, value) values ('jan', 1);
insert into t (month, value) values ('oct', 3);
insert into t (month, value) values ('dec', 96);


select * from (select month, value from t)
pivot
(
    sum(value)
    for month in ('jan', 'oct', 'dec')
);
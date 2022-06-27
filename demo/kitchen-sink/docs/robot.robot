*** Settings ***
Documentation     Robot Framework 4 syntax recipes cheat sheet robot.
...               Demonstrates Robot Framework syntax in a concise format.
Library           MyLibrary
Library           MyLibrary    WITH NAME    HelloLibrary
Library           MyLibrary    greeting=Howdy!    WITH NAME    HowdyLibrary
Resource          keywords.robot
Suite Setup       Log    Suite Setup!
Suite Teardown    Log    Suite Teardown!
Test Setup        Log    Test Setup!
Test Teardown     Log    Test Teardown!
Test Timeout      2 minutes
Variables         variables.py

*** Variables ***
${STRING}=        cat
${NUMBER}=        ${1}
@{LIST}=          one    two    three
&{DICTIONARY}=    string=${STRING}    number=${NUMBER}    list=@{LIST}
${ENVIRONMENT_VARIABLE}=    %{PATH=Default value}

*** Keywords ***
A keyword without arguments
    Log    No arguments.

A keyword with a required argument
    [Arguments]    ${argument}
    Log    Required argument: ${argument}

A keyword with an optional argument
    [Arguments]    ${argument}=Default value
    Log    Optional argument: ${argument}
    ...    Another arg

A keyword with any number of arguments
    [Arguments]    @{varargs}
    Log    Any number of arguments: @{varargs}

A keyword with one or more arguments
    [Arguments]    ${argument}    @{varargs}
    Log    One or more arguments: ${argument} @{varargs}

A keyword that returns a value
    [Return]    Return value

A keyword with documentation
    [Documentation]    This is keyword documentation.
    No Operation

*** Test Cases ***
Call keywords with a varying number of arguments
    [Tags]    Test    Another Tag
    A keyword without arguments
    A keyword with a required argument    Argument
    A keyword with a required argument    argument=Argument
    A keyword with an optional argument
    A keyword with an optional argument    Argument
    A keyword with an optional argument    argument=Argument
    A keyword with any number of arguments
    A keyword with any number of arguments    arg1    arg2    arg3    arg4    arg5
    A keyword with one or more arguments    arg1
    A keyword with one or more arguments    arg1    arg2    arg3

Call a keyword that returns a value
    ${value}=    A keyword that returns a value
    Log    ${value}    # Return value

Do conditional IF - ELSE IF - ELSE execution
    IF    ${NUMBER} > 1
        Log    Greater than one.
    ELSE IF    "${STRING}" == "dog"
        Log    It's a dog!
    ELSE
        Log    Probably a cat. 🤔
    END

Loop a list
    Log    ${LIST}    # ['one', 'two', 'three']
    FOR    ${item}    IN    @{LIST}
        Log    ${item}    # one, two, three
    END
    FOR    ${item}    IN    one    two    three
        Log    ${item}    # one, two, three
    END

Loop a dictionary
    Log    ${DICTIONARY}
    # {'string': 'cat', 'number': 1, 'list': ['one', 'two', 'three']}
    FOR    ${key_value_tuple}    IN    &{DICTIONARY}
        Log    ${key_value_tuple}
        # ('string', 'cat'), ('number', 1), ('list', ['one', 'two', 'three'])
    END
    FOR    ${key}    IN    @{DICTIONARY}
        Log    ${key}=${DICTIONARY}[${key}]
        # string=cat, number=1, list=['one', 'two', 'three']
    END

Loop a range from 0 to end index
    FOR    ${index}    IN RANGE    10
        Log    ${index}    # 0-9
    END

Loop a range from start to end index
    FOR    ${index}    IN RANGE    1    10
        Log    ${index}    # 1-9
    END

Loop a range from start to end index with steps
    FOR    ${index}    IN RANGE    0    10    2
        Log    ${index}    # 0, 2, 4, 6, 8
    END

Nest loops
    @{alphabets}=    Create List    a    b    c
    Log    ${alphabets}    # ['a', 'b', 'c']
    @{numbers}=    Create List    ${1}    ${2}    ${3}
    Log    ${numbers}    # [1, 2, 3]
    FOR    ${alphabet}    IN    @{alphabets}
        FOR    ${number}    IN    @{numbers}
            Log    ${alphabet}${number}
            # a1, a2, a3, b1, b2, b3, c1, c2, c3
        END
    END

Exit a loop on condition
    FOR    ${i}    IN RANGE    5
        Exit For Loop If    ${i} == 2
        Log    ${i}    # 0, 1
    END

Continue a loop from the next iteration on condition
    FOR    ${i}    IN RANGE    3
        Continue For Loop If    ${i} == 1
        Log    ${i}    # 0, 2
    END

Create a scalar variable
    ${animal}=    Set Variable    dog
    Log    ${animal}    # dog
    Log    ${animal}[0]    # d
    Log    ${animal}[-1]    # g

Create a number variable
    ${π}=    Set Variable    ${3.14}
    Log    ${π}    # 3.14

Create a list variable
    @{animals}=    Create List    dog    cat    bear
    Log    ${animals}    # ['dog', 'cat', 'bear']
    Log    ${animals}[0]    # dog
    Log    ${animals}[-1]    # bear

Create a dictionary variable
    &{dictionary}=    Create Dictionary    key1=value1    key2=value2
    Log    ${dictionary}    # {'key1': 'value1', 'key2': 'value2'}
    Log    ${dictionary}[key1]    # value1
    Log    ${dictionary.key2}    # value2

Access the items in a sequence (list, string)
    ${string}=    Set Variable    Hello world!
    Log    ${string}[0]    # H
    Log    ${string}[:5]    # Hello
    Log    ${string}[6:]    # world!
    Log    ${string}[-1]    # !
    @{list}=    Create List    one    two    three    four    five
    Log    ${list}    # ['one', 'two', 'three', 'four', 'five']
    Log    ${list}[0:6:2]    # ['one', 'three', 'five']

Call a custom Python library
    ${greeting}=    MyLibrary.Get Greeting
    Log    ${greeting}    # Hello!
    ${greeting}=    HelloLibrary.Get Greeting
    Log    ${greeting}    # Hello!
    ${greeting}=    HowdyLibrary.Get Greeting
    Log    ${greeting}    # Howdy!

Call a keyword from a separate resource file
    My keyword in a separate resource file

Access a variable in a separate variable file
    Log    ${MY_VARIABLE_FROM_A_SEPARATE_VARIABLE_FILE}

Split arguments to multiple lines
    A keyword with any number of arguments
    ...    arg1
    ...    arg2
    ...    arg3

Log available variables
    Log Variables
    # ${/} = /
    # &{DICTIONARY} = { string=cat | number=1 | list=['one', 'two', 'three'] }
    # ${OUTPUT_DIR} = /Users/<username>/...
    # ...

Evaluate Python expressions
    ${path}=    Evaluate    os.environ.get("PATH")
    ${path}=    Set Variable    ${{os.environ.get("PATH")}}

Use special variables
    Log    ${EMPTY}    # Like the ${SPACE}, but without the space.
    Log    ${False}    # Boolean False.
    Log    ${None}    # Python None
    Log    ${null}    # Java null.
    Log    ${SPACE}    # ASCII space (\x20).
    Log    ${SPACE * 4}    # Four spaces.
    Log    "${SPACE}"    # Quoted space (" ").
    Log    ${True}    # Boolean True.
    LOG    ${CURDIR}  # Current directory

/*
  NSIS Mode
  for Ace
*/

; Includes
!include MUI2.nsh

; Settings
Name "installer_name"
OutFile "installer_name.exe"
RequestExecutionLevel user
CRCCheck on
!ifdef x64
  InstallDir "$PROGRAMFILES64\installer_name"
!else
  InstallDir "$PROGRAMFILES\installer_name"
!endif

; Pages
!insertmacro MUI_PAGE_INSTFILES

; Sections
Section "section_name" section_index
  # your code here
SectionEnd

; Functions
Function .onInit
  MessageBox MB_OK "Here comes a$\n$\rline-break!"
FunctionEnd
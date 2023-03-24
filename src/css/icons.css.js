// Background images are base64 encodings of AWS Cloudscape icons.
/*
 * Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

module.exports = `
.ace_gutter-cell.ace_error, .ace_icon.ace_error {
    background-image: url("data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAxNiAxNiI+PGNpcmNsZSBjeD0iOCIgY3k9IjgiIHI9IjciIHN0cm9rZT0iI0QxMzIxMiIgc3Ryb2tlLXdpZHRoPSIyIiBmaWxsPSJub25lIj48L2NpcmNsZT48cGF0aCBkPSJtMTAuODI4IDUuMTcyLTUuNjU2IDUuNjU2TTEwLjgyOCAxMC44MjggNS4xNzIgNS4xNzIiIHN0cm9rZS13aWR0aD0iMiIgc3Ryb2tlPSIjRDEzMjEyIj48L3BhdGg+PC9zdmc+");
    background-repeat: no-repeat;
    background-size: 12px;
    background-position: 4px center;
}
.ace_dark .ace_gutter-cell.ace_error, .ace_dark .ace_icon.ace_error {
    background-image: url("data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAxNiAxNiI+PGNpcmNsZSBjeD0iOCIgY3k9IjgiIHI9IjciIHN0cm9rZT0iI0ZGNUQ2NCIgc3Ryb2tlLXdpZHRoPSIyIiBmaWxsPSJub25lIj48L2NpcmNsZT48cGF0aCBkPSJtMTAuODI4IDUuMTcyLTUuNjU2IDUuNjU2TTEwLjgyOCAxMC44MjggNS4xNzIgNS4xNzIiIHN0cm9rZS13aWR0aD0iMiIgc3Ryb2tlPSIjRkY1RDY0Ij48L3BhdGg+PC9zdmc+");
    background-repeat: no-repeat;
    background-size: 12px;
    background-position: 4px center;
}

.ace_gutter-cell.ace_warning, .ace_icon.ace_warning {
    background-image: url("data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAxNiAxNiI+PHBhdGggZD0ibTggMSA3IDE0SDFMOCAxeiIgIHN0cm9rZS13aWR0aD0iMiIgc3Ryb2tlPSIjRUM3MjExIiBmaWxsPSJub25lIiBzdHJva2UtbGluZWpvaW49InJvdW5kIj48L3BhdGg+PHBhdGggZD0iTTcuOTkgMTJIOHYuMDFoLS4wMXpNOCA2djQiICBzdHJva2Utd2lkdGg9IjIiIHN0cm9rZT0iI0VDNzIxMSI+PC9wYXRoPjwvc3ZnPg==");
    background-repeat: no-repeat;
    background-size: 12px;
    background-position: 4px center;
}

.ace_gutter-cell.ace_info, .ace_icon.ace_info {
    background-image: url("data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAxNiAxNiI+CjxjaXJjbGUgY3g9IjgiIGN5PSI4IiByPSI3IiBzdHJva2U9IiMwMDczQkIiIHN0cm9rZS13aWR0aD0iMiIgZmlsbD0ibm9uZSI+PC9jaXJjbGU+CjxwYXRoIGQ9Ik04IDExVjgiIHN0cm9rZS13aWR0aD0iMiIgc3Ryb2tlPSIjMDA3M0JCIj48L3BhdGg+CjxwYXRoIGQ9Ik05IDhINiIgc3Ryb2tlLXdpZHRoPSIyIiBzdHJva2U9IiMwMDczQkIiPjwvcGF0aD4KPHBhdGggZD0iTTEwIDExSDYiIHN0cm9rZS13aWR0aD0iMiIgc3Ryb2tlPSIjMDA3M0JCIj48L3BhdGg+CjxwYXRoIGQ9Ik03Ljk5ICA1SDh2LjAxaC0uMDF6IiBzdHJva2Utd2lkdGg9IjIiIHN0cm9rZT0iIzAwNzNCQiI+PC9wYXRoPgo8L3N2Zz4=");
    background-repeat: no-repeat;
    background-size: 12px;
    background-position: 4px center;
}
.ace_dark .ace_gutter-cell.ace_info, .ace_dark .ace_icon.ace_info {
    background-image: url("data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAxNiAxNiI+CjxjaXJjbGUgY3g9IjgiIGN5PSI4IiByPSI3IiBzdHJva2U9IiM0NEI5RDYiIHN0cm9rZS13aWR0aD0iMiIgZmlsbD0ibm9uZSI+PC9jaXJjbGU+CjxwYXRoIGQ9Ik04IDExVjgiIHN0cm9rZS13aWR0aD0iMiIgc3Ryb2tlPSIjNDRCOUQ2Ij48L3BhdGg+CjxwYXRoIGQ9Ik05IDhINiIgc3Ryb2tlLXdpZHRoPSIyIiBzdHJva2U9IiM0NEI5RDYiPjwvcGF0aD4KPHBhdGggZD0iTTEwIDExSDYiIHN0cm9rZS13aWR0aD0iMiIgc3Ryb2tlPSIjNDRCOUQ2Ij48L3BhdGg+CjxwYXRoIGQ9Ik03Ljk5IDVIOHYuMDFoLS4wMXoiIHN0cm9rZS13aWR0aD0iMiIgc3Ryb2tlPSIjNDRCOUQ2Ij48L3BhdGg+Cjwvc3ZnPgo=");
    background-repeat: no-repeat;
    background-size: 12px;
    background-position: 4px center;
}
`;
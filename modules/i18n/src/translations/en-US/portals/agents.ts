/**
 * Copyright (c) 2025, WSO2 LLC. (https://www.wso2.com).
 *
 * WSO2 LLC. licenses this file to you under the Apache License,
 * Version 2.0 (the "License"); you may not use this file except
 * in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied. See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */
import { AgentsNS } from "../../../models/namespaces/agents-ns";

export const agents: AgentsNS = {
    description: "Configure and manage AI agent identities for your organizaton",
    edit: {
        credentials: {
            title: ""
        },
        general: {
            fields: {
                description: {
                    label: "",
                    placeholder: ""
                },
                languageModal: {
                    label: ""
                },
                name: {
                    label: ""
                }
            },
            title: ""
        },
        roles: {
            subtitle: "View roles assigned directly to this agent",
            title: "Roles"

        }
    },
    new: {
        fields: {
            description: {
                label: "Description",
                placeholder: "Enter a description for the agent"
            },
            name: {
                label: "Name"
            }
        }
    },
    pageTitle: "Agents",
    title: "Agents"
};

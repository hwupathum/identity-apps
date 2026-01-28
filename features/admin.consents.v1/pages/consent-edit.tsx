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

import { IdentifiableComponentInterface } from "@wso2is/core/models";
import { RouteComponentProps } from "react-router";
import { ResourceTab, TabPageLayout } from "@wso2is/react-components";
import React, { FunctionComponent, ReactElement, useEffect, useState } from "react";
import { useGetConsent } from "../api/use-get-consent";
import { ConsentInterface, ConsentType } from "../models/consents";
import ViewConsentOverview from "../components/edit-consent/view-consent-overview";
import { EditConsentPolicy } from "../components/edit-consent/edit-consent-policy";
import { ViewConsentUsers } from "../components/edit-consent/view-consent-users";
import { EditConsentAttributes } from "../components/edit-consent/edit-consent-attributes";

/**
 * Props interface for the Consent edit page component.
 */
interface ConsentEditPageProps extends IdentifiableComponentInterface, RouteComponentProps<{ id: string }> { }

/**
 * Consent edit page.
 *
 * @param props - Props injected to the component.
 * @returns Consent edit page component.
 */
const ConsentEditPage: FunctionComponent<ConsentEditPageProps> = (
    props: ConsentEditPageProps
): ReactElement => {
    const {
        match,
        ["data-componentid"]: componentId = "consent-edit-page"
    } = props;

    const id = match?.params?.id;

    const { data: consent, isLoading: isConsentRequestLoading } = useGetConsent(id);

    const handleBackButtonClick = (): void => {
        window.history.back();
    };

    const resolveTabPanes = () => {
        if (!consent) {
            return [];
        }

        return [
            {
                menuItem: "General",
                render: () => (
                    <ResourceTab.Pane controlledSegmentation>
                        <ViewConsentOverview consent={consent} />
                    </ResourceTab.Pane>
                )
            },
            {
                menuItem: "Advanced",
                render: () => (
                    <ResourceTab.Pane controlledSegmentation>
                        {
                            consent.type === ConsentType.POLICY ? (
                                <EditConsentPolicy consentId={consent.id} />
                            ) : (
                                <EditConsentAttributes consentId={consent.id} />
                            )
                        }
                    </ResourceTab.Pane>
                )
            },
            {
                menuItem: "Users",
                render: () => (
                    <ResourceTab.Pane controlledSegmentation>
                        <ViewConsentUsers consentId={consent.id} />
                    </ResourceTab.Pane>
                )
            }
        ];
    };

    return (
        <TabPageLayout
            pageTitle="Edit Consent"
            title={consent?.displayName || ""}
            data-componentid={`${componentId}-layout`}
            isLoading={isConsentRequestLoading}
            backButton={{
                "data-componentid": `${componentId}-page-back-button`,
                onClick: handleBackButtonClick,
                text: "Back to Consents"
            }}
        >
            <ResourceTab
                data-componentid={`${componentId}-resource-tabs`}
                panes={resolveTabPanes()}
            />
        </TabPageLayout>
    );
};

export default ConsentEditPage;

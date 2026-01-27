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

import { getEmptyPlaceholderIllustrations } from "@wso2is/admin.core.v1/configs/ui";
import { IdentifiableComponentInterface } from "@wso2is/core/models";
import {
    AnimatedAvatar,
    AppAvatar,
    DataTable,
    EmptyPlaceholder,
    PrimaryButton,
    TableActionsInterface,
    TableColumnInterface
} from "@wso2is/react-components";
import React, { ReactElement, ReactNode, SyntheticEvent } from "react";
import { useTranslation } from "react-i18next";
import { Header, Icon, SemanticICONS } from "semantic-ui-react";
import { ConsentListItemInterface } from "../models/consents";

/**
 * Props interface for the Consents list component.
 */
interface ConsentsListProps extends IdentifiableComponentInterface {
    /**
     * Advanced search component.
     */
    advancedSearch?: ReactNode;
    /**
     * Is the list loading.
     */
    isLoading?: boolean;
    /**
     * Consent list.
     */
    list: ConsentListItemInterface[];
    /**
     * Callback for when the add consent button is clicked.
     */
    onAddConsentClick: () => void;
    /**
     * Callback for when a consent is clicked for editing.
     */
    onEditConsentClick: (consent: ConsentListItemInterface) => void;
    /**
     * Callback for when a consent is clicked for deletion.
     */
    onDeleteConsentClick: (consent: ConsentListItemInterface) => void;
}

/**
 * Consents list component.
 *
 * @param props - Props injected to the component.
 * @returns Consents list component.
 */
export const ConsentsList = (props: ConsentsListProps): ReactElement => {
    const {
        advancedSearch,
        isLoading,
        list,
        onAddConsentClick,
        onEditConsentClick,
        onDeleteConsentClick,
        ["data-componentid"]: componentId
    } = props;

    const { t } = useTranslation();

    /**
     * Resolves data table actions.
     *
     * @returns TableActionsInterface[]
     */
    const resolveTableActions = (): TableActionsInterface[] => {
        return [
            {
                "data-testid": `${componentId}-item-edit-button`,
                hidden: (): boolean => false,
                icon: (): SemanticICONS => "pencil alternate",
                onClick: (_e: SyntheticEvent, consent: ConsentListItemInterface): void =>
                    onEditConsentClick(consent),
                popupText: (): string => t("common:edit"),
                renderer: "semantic-icon"
            },
            {
                "data-testid": `${componentId}-item-delete-button`,
                hidden: (): boolean => false,
                icon: (): SemanticICONS => "trash alternate",
                onClick: (_e: SyntheticEvent, consent: ConsentListItemInterface): void =>
                    onDeleteConsentClick(consent),
                popupText: (): string => t("common:delete"),
                renderer: "semantic-icon"
            }
        ];
    };

    /**
     * Resolves data table columns.
     *
     * @returns TableColumnInterface[]
     */
    const resolveTableColumns = (): TableColumnInterface[] => {
        return [
            {
                allowToggleVisibility: false,
                dataIndex: "name",
                id: "name",
                key: "name",
                render: (consent: ConsentListItemInterface): ReactNode => {
                    return (
                        <Header
                            image
                            as="h6"
                            className="header-with-icon"
                            data-testid={`${componentId}-item-heading`}
                        >
                            <AppAvatar
                                image={(
                                    <AnimatedAvatar
                                        name={consent.name}
                                        size="mini"
                                        data-testid={`${componentId}-item-display-name-avatar`}
                                    />
                                )}
                                size="mini"
                                spaced="right"
                                data-testid={`${componentId}-item-display-name`}
                            />

                            <Header.Content>
                                {consent.name}
                                <Header.Subheader>{consent.description}</Header.Subheader>
                            </Header.Content>
                        </Header>
                    );
                },
                title: t("console:manage.features.sidePanel.categories.attributes") // Reusing for placeholder
            },
            {
                allowToggleVisibility: false,
                dataIndex: "type",
                id: "type",
                key: "type",
                render: (consent: ConsentListItemInterface): ReactNode => {
                    return (
                        <Header.Content>
                            {consent.type}
                        </Header.Content>
                    );
                },
                title: "Type"
            },
            {
                allowToggleVisibility: false,
                dataIndex: "action",
                id: "actions",
                key: "actions",
                textAlign: "right",
                title: t("common:actions")
            }
        ];
    };

    /**
     * Resolve the relevant placeholder.
     *
     * @returns React element.
     */
    const showPlaceholders = (): ReactElement => {
        if (!list || list?.length === 0) {
            return (
                <EmptyPlaceholder
                    className="list-placeholder mr-0"
                    action={
                        (<PrimaryButton
                            data-testid={`${componentId}-empty-placeholder-add-consent-button`}
                            onClick={onAddConsentClick}
                        >
                            <Icon name="add" />
                            New Consent
                        </PrimaryButton>)
                    }
                    image={getEmptyPlaceholderIllustrations().newList}
                    imageSize="tiny"
                    subtitle={[
                        "There are no consents available at the moment"
                    ]}
                    data-testid={`${componentId}-empty-placeholder`}
                />
            );
        }

        return null;
    };

    return (
        <DataTable<ConsentListItemInterface>
            className="consents-table"
            externalSearch={advancedSearch}
            isLoading={isLoading}
            actions={resolveTableActions()}
            columns={resolveTableColumns()}
            data={list}
            onRowClick={(_e: SyntheticEvent, consent: ConsentListItemInterface): void => {
                onEditConsentClick(consent);
            }}
            placeholders={showPlaceholders()}
            selectable={true}
            showHeader={false}
            transparent={
                !(isLoading)
                && (showPlaceholders() !== null)
            }
            data-testid={componentId}
        />
    );
};

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

import { AppConstants } from "@wso2is/admin.core.v1/constants/app-constants";
import { history } from "@wso2is/admin.core.v1/helpers/history";
import { AdvancedSearchWithBasicFilters } from "@wso2is/admin.core.v1/components/advanced-search-with-basic-filters";
import { UIConstants } from "@wso2is/admin.core.v1/constants/ui-constants";
import { IdentifiableComponentInterface } from "@wso2is/core/models";
import {
     ConfirmationModal,
     ListLayout,
     PageLayout,
     PrimaryButton
 } from "@wso2is/react-components";
 import React, { ReactElement, useEffect, useMemo, useState } from "react";
 import { useTranslation } from "react-i18next";
 import { Dropdown, DropdownProps, Icon } from "semantic-ui-react";
 import { getConsentTypes, getConsents, ConsentListItemInterface, ConsentType, ConsentTypeInterface } from "@wso2is/common.consents.v1";
 import { ConsentsList } from "../components/consents-list";
 import { CreateConsentWizard } from "../components/create-consent-wizard";

/**
 * Props interface for the Consents page component.
 */
type ConsentsPageProps = IdentifiableComponentInterface;

/**
 * Consents page.
 *
 * @param props - Props injected to the component.
 * @returns Consents page component.
 */
const ConsentsPage = (props: ConsentsPageProps): ReactElement => {
    const {
        ["data-componentid"]: componentId = "consents-page"
    } = props;

    const { t } = useTranslation();

    const [searchQuery, setSearchQuery] = useState<string>(null);
    const [listItemLimit, setListItemLimit] = useState<number>(UIConstants.DEFAULT_RESOURCE_LIST_ITEM_LIMIT);
    const [startIndex, setStartIndex] = useState<number>(1);
    const [selectedType, setSelectedType] = useState<string>("All");
    const [showCreateWizard, setShowCreateWizard] = useState<boolean>(false);

    const [showDeleteConfirmationModal, setShowDeleteConfirmationModal] = useState<boolean>(false);
    const [deletingConsent, setDeletingConsent] = useState<ConsentListItemInterface>(null);
    const [isDeleting, setIsDeleting] = useState<boolean>(false);

    const [consents, setConsents] = useState<ConsentListItemInterface[]>([]);
    const [consentTypes, setConsentTypes] = useState<ConsentTypeInterface[]>([]);
    const [isConsentsLoading, setConsentsLoading] = useState<boolean>(true);

    /**
     * Fetch consents and consent types on component mount.
     */
    useEffect(() => {
        setConsentsLoading(true);

        Promise.all([
            getConsents(),
            getConsentTypes()
        ]).then(([ consentsResponse, typesResponse ]: [ ConsentListItemInterface[], ConsentTypeInterface[] ]) => {
            setConsents(consentsResponse);
            setConsentTypes(typesResponse);
        }).finally(() => {
            setConsentsLoading(false);
        });
    }, []);

    /**
     * Filtered consent list based on search and type.
     */
    const filteredConsents = useMemo(() => {
        return consents.filter((consent: ConsentListItemInterface) => {
            const matchesSearch = !searchQuery || 
                consent.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                consent.displayName.toLowerCase().includes(searchQuery.toLowerCase());
            const matchesType = selectedType === "All" || consent.type === selectedType;

            return matchesSearch && matchesType;
        });
    }, [consents, searchQuery, selectedType]);

    /**
     * Handles the search filter.
     *
     * @param query - Search query.
     */
    const handleFilter = (query: string): void => {
        setSearchQuery(query);
        setStartIndex(1);
    };

    /**
     * Handles the items per page dropdown change.
     *
     * @param event - Mouse event.
     * @param data - Dropdown data.
     */
    const handleItemsPerPageDropdownChange = (event: React.MouseEvent<HTMLAnchorElement>, data: DropdownProps) => {
        setListItemLimit(data.value as number);
    };

    /**
     * Handles the consent type dropdown change.
     *
     * @param event - Mouse event.
     * @param data - Dropdown data.
     */
    const handleTypeChange = (event: React.MouseEvent<HTMLAnchorElement>, data: DropdownProps) => {
        setSelectedType(data.value as string);
    };

    /**
     * Handles the consent delete action.
     */
    const handleDeleteConsent = (): void => {
        setIsDeleting(true);

        // TODO: Implement actual delete API call.
        // Mocking the delete logic for now.
        setTimeout(() => {
            setConsents(consents.filter((consent: ConsentListItemInterface) => consent.id !== deletingConsent.id));
            setIsDeleting(false);
            setShowDeleteConfirmationModal(false);
            setDeletingConsent(null);
        }, 1000);
    };

    return (
        <PageLayout
            pageTitle="Consents"
            title="Consents"
            description="Manage and configure user consents."
            data-componentid={`${componentId}-layout`}
            action={(
                <PrimaryButton
                    onClick={() => { setShowCreateWizard(true); }}
                    data-componentid={`${componentId}-add-button`}
                >
                    <Icon name="add" />
                    New Consent
                </PrimaryButton>
            )}
        >
                        <ListLayout
                advancedSearch={ (
                    <AdvancedSearchWithBasicFilters
                        onFilter={ handleFilter }
                        filterAttributeOptions={ [
                            {
                                key: 0,
                                text: t("common:name"),
                                value: "name"
                            }
                        ] }
                        filterAttributePlaceholder={ "Search by name" }
                        placeholder={ "Search consents by name" }
                        defaultSearchAttribute={ "name" }
                        defaultSearchOperator={ "co" }
                        data-testid={ `${ componentId }-list-advanced-search` }
                    />
                ) }
                currentListSize={ filteredConsents.length }
                listItemLimit={ listItemLimit }
                onItemsPerPageDropdownChange={ handleItemsPerPageDropdownChange }
                onPageChange={ () => { } }
                onSortStrategyChange={ () => { } }
                showPagination={ true }
                showTopActionPanel={ true }
                totalPages={ Math.ceil(filteredConsents.length / listItemLimit) }
                totalListSize={ filteredConsents.length }
                isLoading={ isConsentsLoading }
                data-testid={ `${ componentId }-list-layout` }
                leftActionPanel={(
                    <div className="list-type-filter">
                        <Dropdown
                            selection
                            options={[
                                { key: "all", text: "All Types", value: "All" },
                                ...consentTypes.map((type: ConsentTypeInterface) => ({
                                    key: type.id,
                                    text: type.name,
                                    value: type.name
                                }))
                            ]}
                            value={selectedType}
                            onChange={handleTypeChange as any}
                            placeholder="Filter by Type"
                        />
                    </div>
                )}
            >
                <ConsentsList
                    list={filteredConsents}
                    isLoading={isConsentsLoading}
                    onAddConsentClick={() => setShowCreateWizard(true)}
                    onEditConsentClick={(consent: ConsentListItemInterface) => {
                        history.push(AppConstants.getPaths().get("CONSENTS_EDIT")
                            .replace(":id", consent.id));
                    }}
                    onDeleteConsentClick={(consent: ConsentListItemInterface) => {
                        setDeletingConsent(consent);
                        setShowDeleteConfirmationModal(true);
                    }}
                    data-componentid={`${componentId}-list`}
                />
            </ListLayout>
            {
                showDeleteConfirmationModal && (
                    <ConfirmationModal
                        onClose={ () => setShowDeleteConfirmationModal(false) }
                        type="negative"
                        open={ showDeleteConfirmationModal }
                        assertionHint={ (
                            "I confirm that I want to delete this consent."
                        ) }
                        assertionType="checkbox"
                        primaryAction="Confirm"
                        secondaryAction="Cancel"
                        onSecondaryActionClick={ () => setShowDeleteConfirmationModal(false) }
                        onPrimaryActionClick={ () => handleDeleteConsent() }
                        data-testid={ `${ componentId }-delete-confirmation-modal` }
                        closeOnDimmerClick={ false }
                        primaryActionLoading={ isDeleting }
                    >
                        <ConfirmationModal.Header
                            data-testid={ `${ componentId }-delete-confirmation-modal-header` }
                        >
                            Are you sure?
                        </ConfirmationModal.Header>
                        <ConfirmationModal.Message
                            attached
                            negative
                            data-testid={ `${ componentId }-delete-confirmation-modal-message` }
                        >
                            This action is irreversible and will permanently delete the consent.
                        </ConfirmationModal.Message>
                        <ConfirmationModal.Content
                            data-testid={ `${ componentId }-delete-confirmation-modal-content` }
                        >
                            If you delete this consent, users will no longer be prompted for it.
                        </ConfirmationModal.Content>
                    </ConfirmationModal>
                )
            }
            {
                showCreateWizard && (
                    <CreateConsentWizard
                        closeWizard={() => setShowCreateWizard(false)}
                        onUpdate={() => {
                            // TODO: Refresh the list or handle the creation
                            setShowCreateWizard(false);
                        }}
                        data-componentid={`${componentId}-create-wizard`}
                    />
                )
            }
        </PageLayout>
    );
};

export default ConsentsPage;

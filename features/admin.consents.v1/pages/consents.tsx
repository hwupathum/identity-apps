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

import { AdvancedSearchWithBasicFilters } from "@wso2is/admin.core.v1/components/advanced-search-with-basic-filters";
import { UIConstants } from "@wso2is/admin.core.v1/constants/ui-constants";
import { IdentifiableComponentInterface } from "@wso2is/core/models";
import {
    ListLayout,
    PageLayout,
    PrimaryButton
} from "@wso2is/react-components";
import React, { ReactElement, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { Dropdown, DropdownProps, Icon } from "semantic-ui-react";
import { ConsentsList } from "../components/consents-list";
import { CreateConsentWizard } from "../components/create-consent-wizard";
import { ConsentListItemInterface, ConsentType } from "../models/consents";

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

    // Mock data for consents
    const [consents] = useState<ConsentListItemInterface[]>([
        {
            id: "1",
            name: "Privacy Policy",
            type: ConsentType.POLICY
        },
        {
            id: "2",
            name: "Terms and Conditions",
            type: ConsentType.POLICY
        },
        {
            id: "3",
            name: "Analytics Usage Consent",
            type: ConsentType.DATA_USAGE
        }
    ]);

    /**
     * Filtered consent list based on search and type.
     */
    const filteredConsents = useMemo(() => {
        return consents.filter((consent: ConsentListItemInterface) => {
            const matchesSearch = !searchQuery || consent.name.toLowerCase().includes(searchQuery.toLowerCase());
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
                advancedSearch={(
                    <AdvancedSearchWithBasicFilters
                        onFilter={handleFilter}
                        filterAttributeOptions={[
                            {
                                key: 0,
                                text: t("common:name"),
                                value: "name"
                            }
                        ]}
                        filterAttributePlaceholder="Search by name"
                        filterConditionsPlaceholder="Condition"
                        filterValuePlaceholder="Value"
                        placeholder="Search consents by name"
                        defaultSearchAttribute="name"
                        defaultSearchOperator="co"
                        triggerClearQuery={false}
                        data-testid={`${componentId}-list-advanced-search`}
                    />
                )}
                currentListSize={filteredConsents.length}
                isLoading={false}
                listItemLimit={listItemLimit}
                onItemsPerPageDropdownChange={handleItemsPerPageDropdownChange}
                onPageChange={() => { }}
                onSortStrategyChange={() => { }}
                showPagination={true}
                showTopActionPanel={true}
                totalPages={Math.ceil(filteredConsents.length / listItemLimit)}
                totalListSize={filteredConsents.length}
                data-testid={`${componentId}-list-layout`}
                leftActionPanel={(
                    <div className="list-type-filter">
                        <Dropdown
                            selection
                            options={[
                                { key: "all", text: "All Types", value: "All" },
                                { key: "policy", text: ConsentType.POLICY, value: ConsentType.POLICY },
                                { key: "data_usage", text: ConsentType.DATA_USAGE, value: ConsentType.DATA_USAGE }
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
                    isLoading={false}
                    onAddConsentClick={() => setShowCreateWizard(true)}
                    onEditConsentClick={(consent: ConsentListItemInterface) => {
                        // eslint-disable-next-line no-console
                        console.log("Edit consent", consent);
                    }}
                    onDeleteConsentClick={(consent: ConsentListItemInterface) => {
                        // eslint-disable-next-line no-console
                        console.log("Delete consent", consent);
                    }}
                    data-componentid={`${componentId}-list`}
                />
            </ListLayout>
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

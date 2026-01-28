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
import React from "react";
import { useTranslation } from "react-i18next";
import {
    ConfirmationModal,
    DangerZone,
    DangerZoneGroup,
    EmphasizedSegment,
    PrimaryButton
} from "@wso2is/react-components";
import { Grid, Loader } from "semantic-ui-react";
import { FinalForm, FinalFormField, TextFieldAdapter } from "@wso2is/form";
import { IdentifiableComponentInterface } from "@wso2is/core/models";
import { ConsentInterface, ConsentType } from "../../models/consents";
import Box from "@oxygen-ui/react/Box/Box";

interface ViewConsentOverviewProps extends IdentifiableComponentInterface {
    consent: ConsentInterface;
}

export default function ViewConsentOverview(props: ViewConsentOverviewProps) {
    const {
        consent,
        [ "data-componentid" ]: componentId = "view-consent-overview"
    } = props;

    const { t } = useTranslation();

    const [isConsentInfoLoading, setIsConsentInfoLoading] = React.useState<boolean>(false);
    const [consentInfo, setConsentInfo] = React.useState<any>({
        name: consent?.name || "",
        displayName: consent?.displayName || "",
        type: consent?.type || ConsentType.POLICY
    });

    const [showDeleteConfirmation, setShowDeleteConfirmation] = React.useState<boolean>(false);
    const [isDeleting, setIsDeleting] = React.useState<boolean>(false);

    const deleteConsent = () => {
        setIsDeleting(true);
        // TODO: Implement delete logic
        console.log("Deleting consent:", consent.id);

        setTimeout(() => {
            setIsDeleting(false);
            setShowDeleteConfirmation(false);
        }, 1000);
    };

    return (
        <>
            <EmphasizedSegment
                padded="very"
                className="consent-overview-form"
            >
                <Box className="form-container with-max-width">
                    {
                        isConsentInfoLoading ? <Loader /> : (
                            <FinalForm
                                onSubmit={ () => { } }
                                initialValues={consentInfo}
                                render={({ handleSubmit }) => (
                                    <form onSubmit={handleSubmit}>
                                        <Grid columns={1}>
                                            <Grid.Row>
                                                <Grid.Column width={10}>
                                                    <FinalFormField
                                                        disabled
                                                        name="displayName"
                                                        label="Name"
                                                        type="text"
                                                        component={TextFieldAdapter}
                                                        required
                                                        placeholder="Enter consent name"
                                                    />
                                                </Grid.Column>
                                            </Grid.Row>
                                            <Grid.Row>
                                                <Grid.Column width={10}>
                                                    <FinalFormField
                                                        name="type"
                                                        label="Consent Type"
                                                        component={TextFieldAdapter}
                                                        disabled
                                                        required
                                                    />
                                                </Grid.Column>
                                            </Grid.Row>
                                        </Grid>
                                    </form>
                                )}
                            />
                        )
                    }
                </Box>
            </EmphasizedSegment>
            { !consent?.isDefault && (
                <DangerZoneGroup
                    sectionHeader={ t("common:dangerZone") }
                >
                    <DangerZone
                        actionTitle={ "Delete Consent" }
                        header={ "Delete Consent" }
                        subheader={ "Once you delete a consent, there is no going back. Please be certain." }
                        onActionClick={ () => setShowDeleteConfirmation(true) }
                    />
                </DangerZoneGroup>
            ) }
            <ConfirmationModal
                onClose={ () => setShowDeleteConfirmation(false) }
                type="negative"
                open={ showDeleteConfirmation }
                assertionHint={ (
                    "I confirm that I want to delete this consent."
                ) }
                assertionType="checkbox"
                primaryAction="Confirm"
                secondaryAction="Cancel"
                onSecondaryActionClick={ () => setShowDeleteConfirmation(false) }
                onPrimaryActionClick={ () => deleteConsent() }
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
        </>
    );
};

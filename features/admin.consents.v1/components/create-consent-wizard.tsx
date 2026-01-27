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
import { Field, Forms, useTrigger } from "@wso2is/forms";
import { Heading, LinkButton, PrimaryButton, Steps, useWizardAlert } from "@wso2is/react-components";
import React, { FunctionComponent, ReactElement, useState } from "react";
import { useTranslation } from "react-i18next";
import Typography from "@oxygen-ui/react/Typography";
import { Grid, Icon, Modal } from "semantic-ui-react";
import { ConsentType, WizardStepInterface } from "../models/consents";
import UserAttributeList, { SelectedUserAttributeInterface } from "./user-attributes/user-attribute-list";
import { getConsentWizardStepIcons } from "../configs/ui";

/**
 * Interface for the create consent wizard props.
 */
interface CreateConsentWizardProps extends IdentifiableComponentInterface {
    /**
     * Callback to close the wizard.
     */
    closeWizard: () => void;
    /**
     * Callback for when the consent is created.
     */
    onUpdate: () => void;
}

/**
 * Enum for wizard steps.
 */
enum WizardSteps {
    BASIC = "Basic",
    ADVANCED = "Advanced"
}

/**
 * Component to handle addition of a new consent.
 *
 * @param props - Props related to the create consent wizard.
 * @returns Create consent wizard component.
 */
export const CreateConsentWizard: FunctionComponent<CreateConsentWizardProps> = (
    props: CreateConsentWizardProps
): ReactElement => {
    const {
        closeWizard,
        onUpdate,
        ["data-componentid"]: componentId
    } = props;

    const { t } = useTranslation();
    const [alert, setAlert, alertComponent] = useWizardAlert();

    const [currentStep, setCurrentWizardStep] = useState<number>(0);
    const [wizardState, setWizardState] = useState<any>(null);
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

    const [submitBasicDetails, setSubmitBasicDetails] = useTrigger();
    const [submitAdvancedDetails, setSubmitAdvancedDetails] = useTrigger();

    const [selectedUserAttributes, setSelectedUserAttributes] = useState<SelectedUserAttributeInterface[]>([]);

    /**
     * Handles the wizard finish action.
     *
     * @param values - Wizard values.
     */
    const handleWizardFinish = (values: any) => {
        setIsSubmitting(true);
        // eslint-disable-next-line no-console
        console.log("Creating Consent:", values);

        // Mocking a successful creation
        setTimeout(() => {
            setIsSubmitting(false);
            onUpdate();
            closeWizard();
        }, 1000);
    };

    /**
     * Handles the basic details form submit.
     *
     * @param values - Form values.
     */
    const handleBasicDetailsSubmit = (values: any) => {
        const data = {
            name: values.get("name"),
            type: values.get("type")
        };
        setWizardState({ ...wizardState, basic: data });
        setCurrentWizardStep(1);
    };

    /**
     * Handles the advanced details form submit.
     *
     * @param values - Form values.
     */
    const handleAdvancedDetailsSubmit = (values: any) => {
        const data = {
            attributes: selectedUserAttributes,
            description: values.get("description"),
            policyUrl: values.get("policyUrl"),
            updateNoticeMessage: values.get("updateNoticeMessage")
        };

        handleWizardFinish({ ...wizardState, advanced: data });
    };

    /**
     * Navigates to the next step.
     */
    const navigateToNext = () => {
        if (currentStep === 0) {
            setSubmitBasicDetails();
        } else {
            setSubmitAdvancedDetails();
        }
    };

    /**
     * Navigates to the previous step.
     */
    const navigateToPrevious = () => {
        setCurrentWizardStep(currentStep - 1);
    };

    /**
     * Resolve the step content.
     *
     * @returns Step content.
     */
    const resolveStepContent = (): ReactElement => {
        switch (currentStep) {
            case 0:
                return (
                    <Forms
                        key={0}
                        onSubmit={(values: any) => handleBasicDetailsSubmit(values)}
                        submitState={submitBasicDetails}
                    >
                        <Grid>
                            <Grid.Row>
                                <Grid.Column width={16}>
                                    <Field
                                        data-componentid={`${componentId}-name`}
                                        name="name"
                                        label="Name"
                                        placeholder="Enter consent name"
                                        required={true}
                                        requiredErrorMessage="Consent name is required"
                                        type="text"
                                        value={wizardState?.basic?.name}
                                    />
                                </Grid.Column>
                            </Grid.Row>
                            <Grid.Row>
                                <Grid.Column width={16}>
                                    <Field
                                        data-componentid={`${componentId}-type`}
                                        name="type"
                                        label="Consent Type"
                                        required={true}
                                        requiredErrorMessage="Consent type is required"
                                        type="dropdown"
                                        children={[
                                            { key: "policy", text: ConsentType.POLICY, value: ConsentType.POLICY },
                                            { key: "data_usage", text: ConsentType.DATA_USAGE, value: ConsentType.DATA_USAGE }
                                        ]}
                                        value={wizardState?.basic?.type ?? ConsentType.POLICY}
                                    />
                                </Grid.Column>
                            </Grid.Row>
                        </Grid>
                    </Forms>
                );
            case 1:
                return (
                    <Forms
                        key={1}
                        onSubmit={(values: any) => handleAdvancedDetailsSubmit(values)}
                        submitState={submitAdvancedDetails}
                    >
                        <Grid>
                            {wizardState?.basic?.type === ConsentType.POLICY && (
                                <Grid.Row>
                                    <Grid.Column width={16}>
                                        <Field
                                            data-componentid={`${componentId}-policy-url`}
                                            name="policyUrl"
                                            label="Policy URL"
                                            placeholder="Enter policy URL"
                                            required={true}
                                            requiredErrorMessage="Policy URL is required"
                                            type="text"
                                            value={wizardState?.advanced?.policyUrl}
                                        />
                                    </Grid.Column>
                                </Grid.Row>
                            )}
                            <Grid.Row>
                                <Grid.Column width={16}>
                                    <Field
                                        data-componentid={`${componentId}-description`}
                                        name="description"
                                        label="Description"
                                        placeholder="Enter consent description"
                                        required={true}
                                        requiredErrorMessage="Consent description is required"
                                        type="textarea"
                                        value={wizardState?.advanced?.description}
                                    />
                                </Grid.Column>
                            </Grid.Row>
                            {wizardState?.basic?.type === ConsentType.POLICY && (
                                <Grid.Row>
                                    <Grid.Column width={16}>
                                        <Field
                                            data-componentid={`${componentId}-update-notice-message`}
                                            name="updateNoticeMessage"
                                            label="Update Notice Message"
                                            placeholder="Enter update notice message"
                                            required={false}
                                            type="text"
                                            value={wizardState?.advanced?.updateNoticeMessage}
                                        />
                                    </Grid.Column>
                                </Grid.Row>
                            )}
                            {wizardState?.basic?.type === ConsentType.DATA_USAGE && (
                                <Grid.Row>
                                    <Grid.Column width={16}>
                                        <Typography variant="h6" className="heading-container" >
                                            User Attributes
                                        </Typography>
                                        <UserAttributeList
                                            initialValues={selectedUserAttributes}
                                            onAttributesChange={(hasChanged: boolean, selectedUserAttributes: SelectedUserAttributeInterface[]) => {
                                                setSelectedUserAttributes(selectedUserAttributes);
                                            }}
                                            isReadOnly={false}
                                            data-componentid={`${componentId}-user-attributes`}
                                        />
                                    </Grid.Column>
                                </Grid.Row>
                            )}
                        </Grid>
                    </Forms>
                );
            default:
                return null;
        }
    };

    const STEPS: WizardStepInterface[] = [
        {
            icon: getConsentWizardStepIcons().general,
            name: WizardSteps.BASIC,
            title: "Basic"
        },
        {
            icon: getConsentWizardStepIcons().advanced,
            name: WizardSteps.ADVANCED,
            title: "Advanced"
        }
    ];

    return (
        <Modal
            open
            className="wizard create-consent-wizard"
            dimmer="blurring"
            size="small"
            onClose={closeWizard}
            closeOnDimmerClick={false}
            closeOnEscape={false}
            data-componentid={componentId}
        >
            <Modal.Header className="wizard-header">
                Create Consent
                <Heading as="h6">Provide basic details for the new consent.</Heading>
            </Modal.Header>
            <Modal.Content className="steps-container">
                <Steps.Group current={currentStep}>
                    {STEPS.map((step, index) => (
                        <Steps.Step
                            key={index}
                            icon={step.icon}
                            title={step.title}
                        />
                    ))}
                </Steps.Group>
            </Modal.Content>
            <Modal.Content className="content-container" scrolling>
                {alert && alertComponent}
                {resolveStepContent()}
            </Modal.Content>
            <Modal.Actions>
                <Grid>
                    <Grid.Row column={1}>
                        <Grid.Column mobile={8} tablet={8} computer={8}>
                            <LinkButton
                                floated="left"
                                onClick={closeWizard}
                                data-componentid={`${componentId}-cancel-button`}
                            >
                                {t("common:cancel")}
                            </LinkButton>
                        </Grid.Column>
                        <Grid.Column mobile={8} tablet={8} computer={8} textAlign="right">
                            {currentStep === STEPS.length - 1 && (
                                <PrimaryButton
                                    floated="right"
                                    onClick={navigateToNext}
                                    data-componentid={`${componentId}-finish-button`}
                                    loading={isSubmitting}
                                    disabled={isSubmitting}
                                >
                                    {t("common:finish")}
                                </PrimaryButton>
                            )}
                            {currentStep < STEPS.length - 1 && (
                                <PrimaryButton
                                    floated="right"
                                    onClick={navigateToNext}
                                    data-componentid={`${componentId}-next-button`}
                                >
                                    {t("common:next")}
                                    <Icon name="arrow right" />
                                </PrimaryButton>
                            )}
                            {currentStep > 0 && (
                                <LinkButton
                                    floated="right"
                                    onClick={navigateToPrevious}
                                    data-componentid={`${componentId}-previous-button`}
                                >
                                    <Icon name="arrow left" />
                                    {t("common:previous")}
                                </LinkButton>
                            )}
                        </Grid.Column>
                    </Grid.Row>
                </Grid>
            </Modal.Actions>
        </Modal >
    );
};

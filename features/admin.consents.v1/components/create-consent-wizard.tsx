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
import { FinalForm, FinalFormField, TextFieldAdapter, SelectFieldAdapter, FormRenderProps } from "@wso2is/form";
import { Code, Heading, Hint, LinkButton, PrimaryButton, Steps, useWizardAlert } from "@wso2is/react-components";
import React, { FunctionComponent, ReactElement, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import Typography from "@oxygen-ui/react/Typography";
import { Grid, Icon, Modal } from "semantic-ui-react";
import { useGetConsentTypes, ConsentType, ConsentTypeInterface, WizardStepInterface } from "@wso2is/common.consents.v1";
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
    const [wizardState, setWizardState] = useState<any>({ basic: { type: ConsentType.POLICY } });
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

    const { data: consentTypes } = useGetConsentTypes();

    const basicFormRef = useRef<any>(null);
    const advancedFormRef = useRef<any>(null);

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
        setWizardState({ ...wizardState, basic: values });
        setCurrentWizardStep(1);
    };

    /**
     * Handles the advanced details form submit.
     *
     * @param values - Form values.
     */
    const handleAdvancedDetailsSubmit = (values: any) => {
        const data = {
            ...values,
            attributes: selectedUserAttributes
        };

        handleWizardFinish({ ...wizardState, advanced: data });
    };

    /**
     * Navigates to the next step.
     */
    const navigateToNext = () => {
        if (currentStep === 0 && basicFormRef.current) {
            basicFormRef.current.handleSubmit();
        } else if (currentStep === 1 && advancedFormRef.current) {
            advancedFormRef.current.handleSubmit();
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
                    <FinalForm
                        onSubmit={(values: any) => handleBasicDetailsSubmit(values)}
                        initialValues={wizardState?.basic}
                        render={({ handleSubmit }: FormRenderProps) => {
                            basicFormRef.current = { handleSubmit };
                            return (
                                <form onSubmit={handleSubmit}>
                                    <Grid>
                                        <Grid.Row>
                                            <Grid.Column mobile={ 16 } computer={ 10 }>
                                                <FinalFormField
                                                    data-componentid={`${componentId}-name`}
                                                    name="name"
                                                    label="Name"
                                                    placeholder="Enter consent name"
                                                    required
                                                    type="text"
                                                    component={TextFieldAdapter}
                                                />
                                            </Grid.Column>
                                        </Grid.Row>
                                        <Grid.Row>
                                            <Grid.Column mobile={ 16 } computer={ 10 }>
                                                <FinalFormField
                                                    data-componentid={`${componentId}-type`}
                                                    name="type"
                                                    label="Consent Type"
                                                    required
                                                    type="dropdown"
                                                    component={SelectFieldAdapter}
                                                    select
                                                    options={
                                                        consentTypes.map((type: ConsentTypeInterface) => ({
                                                            key: type.id,
                                                            text: type.name,
                                                            value: type.name
                                                        }))
                                                    }
                                                />
                                            </Grid.Column>
                                        </Grid.Row>
                                    </Grid>
                                </form>
                            );
                        }}
                    />
                );
            case 1:
                return (
                    <FinalForm
                        onSubmit={(values: any) => handleAdvancedDetailsSubmit(values)}
                        initialValues={wizardState?.advanced}
                        render={({ handleSubmit }: FormRenderProps) => {
                            advancedFormRef.current = { handleSubmit };
                            return (
                                <form onSubmit={handleSubmit}>
                                    <Grid>
                                        {wizardState?.basic?.type === ConsentType.POLICY && (
                                            <Grid.Row>
                                                <Grid.Column  width={ 16 }>
                                                    <FinalFormField
                                                        data-componentid={`${componentId}-policy-url`}
                                                        name="policyUrl"
                                                        label="Policy URL"
                                                        required
                                                        type="text"
                                                        component={TextFieldAdapter}
                                                        placeholder={
                                                            t("branding:brandingCustomText.form.genericFieldPlaceholder")
                                                        }
                                                        helperText={(
                                                            <Hint>
                                                                Provide the URL where the full policy document can be
                                                                accessed. You can use placeholders like
                                                                <Code>&#123;&#123;lang&#125;&#125;</Code>, 
                                                                <Code>&#123;&#123;country&#125;&#125;</Code>,
                                                                or <Code>&#123;&#123;locale&#125;&#125;</Code> to 
                                                                customize the URL for different regions or languages.
                                                            </Hint>
                                                        )}
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
                                </form>
                            );
                        }}
                    />
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

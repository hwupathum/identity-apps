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
import { Code, EmphasizedSegment, Hint, PrimaryButton } from "@wso2is/react-components";
import { Grid, Loader } from "semantic-ui-react";
import { FinalForm, FinalFormField, TextFieldAdapter } from "@wso2is/form";
import Box from "@oxygen-ui/react/Box/Box";
import { useTranslation } from "react-i18next";
import { useGetConsent, updateConsent } from "@wso2is/common.consents.v1";
import { AlertLevels, IdentifiableComponentInterface } from "@wso2is/core/models";
import { addAlert } from "@wso2is/core/store";
import { useDispatch } from "react-redux";
import { Dispatch } from "redux";
import { BrandingPreferenceTypes } from "@wso2is/common.branding.v1/models";
import useGetBrandingPreferenceResolve from "@wso2is/common.branding.v1/api/use-get-branding-preference-resolve";
import { AppConstants } from "@wso2is/admin.core.v1/constants/app-constants";

interface EditConsentPolicyProps extends IdentifiableComponentInterface {
    consentId: string;
}

export const EditConsentPolicy = (props: EditConsentPolicyProps) => {
    const { consentId, [ "data-componentid" ]: componentId } = props;

    const { t } = useTranslation();
    const dispatch: Dispatch = useDispatch();

    const {
        data: consent,
        isLoading: isPolicyInfoLoading,
        mutate: mutateConsent
    } = useGetConsent(consentId);

    const {
        data: brandingPreference,
        isLoading: isBrandingLoading
    } = useGetBrandingPreferenceResolve(AppConstants.getTenant(), BrandingPreferenceTypes.ORG);

    const [ isSubmitting, setIsSubmitting ] = React.useState<boolean>(false);

    const brandingPolicyUrl = React.useMemo(() => {
        if (!brandingPreference) {
            return "";
        }

        if (consent?.name === "policy:privacy_policy") {
            return brandingPreference.preference.urls.privacyPolicyURL;
        } else if (consent?.name === "policy:terms_and_conditions") {
            return brandingPreference.preference.urls.termsOfUseURL;
        } else if (consent?.name === "policy:cookie_policy") {
            return brandingPreference.preference.urls.cookiePolicyURL;
        }

        return "";
    }, [ brandingPreference, consent ]);

    const initialValues = React.useMemo(() => {
        if (!consent) {
            return null;
        }

        return {
            ...consent,
            policyUrl: consent.policyUrl || brandingPolicyUrl
        };
    }, [ consent, brandingPolicyUrl ]);

    const updatePolicyInfo = (values: any) => {
        setIsSubmitting(true);

        const updatedElements = consent.elements.map((element: any) => {
            if (element.name.startsWith("url:")) {
                return {
                    ...element,
                    properties: {
                        ...element.properties,
                        url: values.policyUrl
                    }
                };
            }

            return element;
        });

        updateConsent(consentId, {
            ...values,
            elements: updatedElements
        })
            .then(() => {
                dispatch(addAlert({
                    description: "Policy updated successfully",
                    level: AlertLevels.SUCCESS,
                    message: "Update Successful"
                }));
                mutateConsent();
            })
            .catch(() => {
                dispatch(addAlert({
                    description: "Policy update failed",
                    level: AlertLevels.ERROR,
                    message: "Update Error"
                }));
            })
            .finally(() => {
                setIsSubmitting(false);
            });
    };

    return (
        <>
            <EmphasizedSegment
                padded="very"
                className="consent-policy-form"
            >
                <Box className="form-container with-max-width">
                    {
                        isPolicyInfoLoading || isBrandingLoading ? <Loader /> : (
                            <FinalForm
                                onSubmit={(values: any) => {
                                    updatePolicyInfo(values);
                                }}
                                initialValues={initialValues}
                                render={({ handleSubmit }) => (
                                    <form onSubmit={handleSubmit}>
                                        <Grid columns={1}>
                                            <Grid.Row>
                                                <Grid.Column>
                                                    <FinalFormField
                                                        name="policyUrl"
                                                        label="Policy URL"
                                                        type="text"
                                                        component={TextFieldAdapter}
                                                        required
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
                                            <Grid.Row>
                                                <Grid.Column>
                                                    <PrimaryButton 
                                                        type="submit"
                                                        loading={isSubmitting}
                                                    >
                                                        Update
                                                    </PrimaryButton>
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
        </>
    );
};

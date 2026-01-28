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
import { EmphasizedSegment, PrimaryButton } from "@wso2is/react-components";
import { Grid, Loader } from "semantic-ui-react";
import { FinalForm, FinalFormField } from "@wso2is/form";
import { TextFieldAdapter } from "@wso2is/form/src";
import Typography from "@oxygen-ui/react/Typography";
import UserAttributeList, { SelectedUserAttributeInterface } from "../user-attributes/user-attribute-list";
import Box from "@oxygen-ui/react/Box/Box";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { Dispatch } from "redux";
import { useGetConsent } from "../../api/use-get-consent";
import { updateConsent } from "../../api/consents";
import { AlertLevels, IdentifiableComponentInterface } from "@wso2is/core/models";
import { addAlert } from "@wso2is/core/store";

interface EditConsentAttributesProps extends IdentifiableComponentInterface {
    consentId: string;
}

export const EditConsentAttributes = (props: EditConsentAttributesProps) => {
    const { consentId, ["data-componentid"]: componentId } = props;

    const { t } = useTranslation();
    const dispatch: Dispatch = useDispatch();

    const {
        data: consent,
        isLoading: isAttributesInfoLoading,
        mutate: mutateConsent
    } = useGetConsent(consentId);

    const [isSubmitting, setIsSubmitting] = React.useState<boolean>(false);
    const [selectedUserAttributes, setSelectedUserAttributes] = React.useState<SelectedUserAttributeInterface[]>([]);

    React.useEffect(() => {
        if (consent && consent.elements) {
            setSelectedUserAttributes(
                consent.elements
                    .filter((element: any) => element.name.startsWith("claim:"))
                    .map((element: any) => ({
                        claimURI: element.properties?.claim_url || "",
                        mandatory: element.isMandatory
                    }))
            );
        }
    }, [consent]);

    const attributes = React.useMemo(() => {
        if (!consent || !consent.elements) {
            return [];
        }

        return consent.elements
            .filter((element: any) => element.name.startsWith("claim:"))
            .map((element: any) => ({
                claimURI: element.properties?.claim_url || "",
                mandatory: element.isMandatory
            }));
    }, [consent]);

    const updateConsentAttributes = (values: any) => {
        setIsSubmitting(true);
        updateConsent(consentId, {
            ...values,
            elements: [
                ...consent.elements.filter((element: any) => !element.name.startsWith("claim:")),
                ...selectedUserAttributes.map((attr: SelectedUserAttributeInterface) => ({
                    name: `claim:${attr.claimURI.split("/").pop()}`, // This is a bit of a hack, but matches our mapping
                    isMandatory: attr.mandatory
                }))
            ]
        })
            .then(() => {
                dispatch(addAlert({
                    description: "Attributes updated successfully",
                    level: AlertLevels.SUCCESS,
                    message: "Update Successful"
                }));
                mutateConsent();
            })
            .catch(() => {
                dispatch(addAlert({
                    description: "Attributes update failed",
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
                className="consent-attributes-form"
            >
                <Box className="form-container with-max-width">
                    {
                        isAttributesInfoLoading ? <Loader /> : (
                            <FinalForm
                                onSubmit={(values: any) => {
                                    updateConsentAttributes(values);
                                }}
                                initialValues={consent}
                                render={({ handleSubmit }) => (
                                    <form onSubmit={handleSubmit}>
                                        <Grid columns={1}>
                                            <Grid.Row>
                                                <Grid.Column>
                                                    <FinalFormField
                                                        name="description"
                                                        label="Description"
                                                        type="text"
                                                        component={TextFieldAdapter}
                                                        required
                                                        placeholder="Enter consent description"
                                                        multiline
                                                        rows={4}
                                                    />
                                                </Grid.Column>
                                            </Grid.Row>
                                            <Grid.Row>
                                                <Grid.Column>
                                                    <Typography variant="h6" className="heading-container">
                                                        User Attributes
                                                    </Typography>
                                                    <UserAttributeList
                                                        initialValues={attributes}
                                                        onAttributesChange={(hasChanged: boolean, attributes: SelectedUserAttributeInterface[]) => {
                                                            setSelectedUserAttributes(attributes);
                                                        }}
                                                        isReadOnly={false}
                                                        data-componentid="edit-consent-user-attributes"
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

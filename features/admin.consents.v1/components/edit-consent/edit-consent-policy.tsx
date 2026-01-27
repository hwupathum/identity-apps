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
import Box from "@oxygen-ui/react/Box/Box";

interface EditConsentPolicyProps {
    consentId: string;
}

export const EditConsentPolicy = (props: EditConsentPolicyProps) => {
    const { consentId } = props;

    const [isPolicyInfoLoading, setIsPolicyInfoLoading] = React.useState<boolean>(false);

    // Mock data lookup by consent ID
    const getMockPolicyData = (id: string) => {
        const mockData: Record<string, any> = {
            "96d31cb9-558d-4c3b-9a6c-0da2ba9ed174": {
                policyUrl: "https://example.com/privacy-policy",
                description: "This privacy policy describes how we collect, use, and protect your personal information.",
                updateNoticeMessage: "We have updated our privacy policy. Please review the changes."
            },
            "ed3976cc-10cb-4a42-81c4-7d439ec9468d": {
                policyUrl: "https://example.com/terms-and-conditions",
                description: "These terms and conditions outline the rules and regulations for the use of our services.",
                updateNoticeMessage: "Our terms have been updated to reflect new service offerings."
            }
        };

        return mockData[id] || {
            policyUrl: "",
            description: "",
            updateNoticeMessage: ""
        };
    };

    const [policyInfo, setPolicyInfo] = React.useState<any>(() => getMockPolicyData(consentId));

    const updatePolicyInfo = (values: any) => {
        // TODO: Implement update logic
        console.log("Updating policy info:", values);
    };

    return (
        <>
            <EmphasizedSegment
                padded="very"
                className="consent-policy-form"
            >
                <Box className="form-container with-max-width">
                    {
                        isPolicyInfoLoading ? <Loader /> : (
                            <FinalForm
                                onSubmit={(values: any) => {
                                    updatePolicyInfo(values);
                                }}
                                initialValues={policyInfo}
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
                                                        placeholder="Enter policy URL"
                                                    />
                                                </Grid.Column>
                                            </Grid.Row>
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
                                                    <FinalFormField
                                                        name="updateNoticeMessage"
                                                        label="Update Notice Message"
                                                        type="text"
                                                        component={TextFieldAdapter}
                                                        placeholder="Enter update notice message"
                                                    />
                                                </Grid.Column>
                                            </Grid.Row>
                                            <Grid.Row>
                                                <Grid.Column>
                                                    <PrimaryButton type="submit">
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

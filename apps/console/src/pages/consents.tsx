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

import { PageLayout } from "@wso2is/react-components";
import React, { ReactElement } from "react";
import { useTranslation } from "react-i18next";

/**
 * Consents page.
 *
 * @returns Consents page component.
 */
const ConsentsPage = (): ReactElement => {
    const { t } = useTranslation();

    return (
        <PageLayout
            title={t("console:develop.pages.consents.title")}
            description={t("console:develop.pages.consents.description")}
            data-testid="consents-page"
        >
            <div>Consents Page Content</div>
        </PageLayout>
    );
};

export default ConsentsPage;

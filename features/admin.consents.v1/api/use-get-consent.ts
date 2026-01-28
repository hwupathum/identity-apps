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

import { useEffect, useState } from "react";
import { getConsent } from "./consents";
import { ConsentInterface } from "../models/consents";

/**
 * Hook to get the consent details by ID.
 *
 * @param id - ID of the consent.
 * @returns The consent details and the loading state.
 */
export const useGetConsent = (id: string) => {
    const [consent, setConsent] = useState<ConsentInterface>(null);
    const [isLoading, setIsLoading] = useState<boolean>(true);

    const fetchConsent = () => {
        setIsLoading(true);

        getConsent(id)
            .then((response: ConsentInterface) => {
                setConsent(response);
            })
            .finally(() => {
                setIsLoading(false);
            });
    };

    useEffect(() => {
        if (!id) {
            return;
        }

        fetchConsent();
    }, [ id ]);

    return {
        data: consent,
        isLoading,
        mutate: fetchConsent
    };
};

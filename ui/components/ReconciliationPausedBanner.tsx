"use client";

import {
  Banner,
  Bullseye,
  Button,
  Flex,
  FlexItem,
} from "@/libs/patternfly/react-core";
import { useTranslations } from "next-intl";
import { useReconciliationContext } from "./ReconciliationContext";
import { updateKafkaCluster } from "@/api/kafka/actions";
import { useState } from "react";
import { ReconciliationModal } from "./ClusterOverview/ReconciliationModal";

export function ReconciliationPausedBanner({ kafkaId }: { kafkaId: string }) {
  const t = useTranslations();

  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const { isReconciliationPaused, setReconciliationPaused } =
    useReconciliationContext();

  const resumeReconciliation = async () => {
    try {
      const response = await updateKafkaCluster(kafkaId, false);

      if (response.errors) {
        console.log("Unknown error occurred", response.errors);
      } else {
        setReconciliationPaused(false);
        setIsModalOpen(false);
      }
    } catch (e: unknown) {
      console.log("Unknown error occurred");
    }
  };

  if (!isReconciliationPaused) return null;

  return (
    <>
      <Banner color="yellow">
        <Bullseye>
          <Flex>
            <FlexItem spacer={{ default: "spacerNone" }}>
              {t("reconciliation.reconciliation_paused_warning")}
            </FlexItem>
            &nbsp;
            <FlexItem spacer={{ default: "spacerLg" }}>
              <Button
                variant="link"
                isInline
                onClick={() => setIsModalOpen(true)}
              >
                {t("reconciliation.resume")}
              </Button>
            </FlexItem>
          </Flex>
        </Bullseye>
      </Banner>
      {isModalOpen && (
        <ReconciliationModal
          isModalOpen={isModalOpen}
          onClickClose={() => setIsModalOpen(false)}
          onClickPauseReconciliation={resumeReconciliation}
          isReconciliationPaused={isReconciliationPaused}
        />
      )}
    </>
  );
}

import { Modal } from "./Modal";
import { ContentForm, SeasonForm, EpisodeForm } from "../content/ContentForms";
import { genres } from "./utils/utils";
import { useTranslation } from "../../../i18n/I18nContext";

export const ContentModals = ({
  modals,
  forms,
  onModalClose,
  onFormChange,
  onSave,
}) => {
  const { t } = useTranslation();
  return (
    <>
      {/* Content Add Modal */}
      <Modal
        show={modals.add}
        title={t("admin.modals.addContent")}
        onClose={() => onModalClose("add")}
        onSave={onSave.content}
        saveText={t("common.add")}
      >
        <ContentForm
          content={forms.newContent}
          onChange={(content) =>
            onFormChange((prev) => ({ ...prev, newContent: content }))
          }
          genres={genres}
        />
      </Modal>

      {/* Content Edit Modal */}
      <Modal
        show={modals.edit}
        title={
          forms.editingContent?.type === "movie"
            ? t("admin.modals.editMovie")
            : t("admin.modals.editSeries")
        }
        onClose={() => onModalClose("edit")}
        onSave={onSave.editContent}
      >
        {forms.editingContent && (
          <ContentForm
            content={forms.editingContent}
            onChange={(content) =>
              onFormChange((prev) => ({ ...prev, editingContent: content }))
            }
            genres={genres}
          />
        )}
      </Modal>

      {/* Modals for adding/editing seasons and episodes */}
      <Modal
        show={modals.addSeason}
        title={t("admin.modals.addSeason")}
        onClose={() => onModalClose("addSeason")}
        onSave={onSave.season}
        saveText={t("common.add")}
      >
        <SeasonForm
          season={forms.newSeason}
          onChange={(season) =>
            onFormChange((prev) => ({ ...prev, newSeason: season }))
          }
        />
      </Modal>

      <Modal
        show={modals.editSeason}
        title={t("admin.modals.editSeason")}
        onClose={() => onModalClose("editSeason")}
        onSave={onSave.editSeason}
      >
        {forms.editingSeason && (
          <SeasonForm
            season={forms.editingSeason}
            onChange={(season) =>
              onFormChange((prev) => ({ ...prev, editingSeason: season }))
            }
          />
        )}
      </Modal>

      <Modal
        show={modals.addEpisode}
        title={t("admin.modals.addEpisode")}
        onClose={() => onModalClose("addEpisode")}
        onSave={onSave.episode}
        saveText={t("common.add")}
      >
        <EpisodeForm
          episode={forms.newEpisode}
          onChange={(episode) =>
            onFormChange((prev) => ({ ...prev, newEpisode: episode }))
          }
        />
      </Modal>

      <Modal
        show={modals.editEpisode}
        title={t("admin.modals.editEpisode")}
        onClose={() => onModalClose("editEpisode")}
        onSave={onSave.editEpisode}
      >
        {forms.editingEpisode && (
          <EpisodeForm
            episode={forms.editingEpisode}
            onChange={(episode) =>
              onFormChange((prev) => ({ ...prev, editingEpisode: episode }))
            }
          />
        )}
      </Modal>
    </>
  );
};

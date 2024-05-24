import { useAuth } from '../../../hooks/auth';
import { useBlocksQuery } from '../../Questionaries/useQuestionariesQuery';
import { BlockType, QuestionType, ReplyType } from '../../Questionaries/types';
import { ComponentType, useMemo } from 'react';
import { TreatmentType } from '..';
import { useParams } from 'react-router-dom';
import { LoadingLayout } from '../../../layout/LoadingLayout';
import { useTreatmentsQuery } from '../../../shared/api/useTreatmentsQuery';

interface WithDataFetchingProps {
  blocks: BlockType[];
  questions: QuestionType[];
  replies: ReplyType[];
  treatment?: TreatmentType;
}

const withTreatmentFetching = (
  WrappedComponent: ComponentType<WithDataFetchingProps>,
) => {
  return function withTreatmentFetchingComponent() {
    const { treatmentId } = useParams();
    const { user } = useAuth();
    const userFirebaseId = user.firebase_id;

    const { data: blocksQuery, isLoading: isLoadingBlocksQuery } =
      useBlocksQuery(userFirebaseId);

    const { data: treatmentsQuery, isLoading: isLoadingTreatmentsQuery } =
      useTreatmentsQuery();

    const blocks: BlockType[] = useMemo(
      () =>
        blocksQuery?.data.sort(
          (a: BlockType, b: BlockType) =>
            new Date(a.created_at).valueOf() - new Date(b.created_at).valueOf(),
        ),
      [blocksQuery],
    );

    if (isLoadingBlocksQuery || isLoadingTreatmentsQuery) {
      return <LoadingLayout />;
    }

    const questions = blocks.map(block => block.questions).flat(1);
    const replies = questions.map(question => question.replies).flat(1);

    const treatment: TreatmentType | undefined = treatmentId
      ? treatmentsQuery?.data.find(
          (treatment: TreatmentType) => treatment.id === +treatmentId,
        )
      : undefined;

    return (
      <WrappedComponent
        blocks={blocks}
        questions={questions}
        replies={replies}
        treatment={treatment}
      />
    );
  };
};

export default withTreatmentFetching;
